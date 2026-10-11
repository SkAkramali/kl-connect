const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
initializeApp();
const db = getFirestore();
const adminOnly = request => { if (!request.auth?.token?.admin) throw new HttpsError("permission-denied", "Administrator permission is required."); };
const text = (value, name) => { if (typeof value !== "string" || !value.trim()) throw new HttpsError("invalid-argument", `${name} is required.`); return value.trim(); };
async function deleteQuery(q) { let deleted = 0; while (true) { const page = await q.limit(300).get(); if (page.empty) return deleted; const batch = db.batch(); page.docs.forEach(d => batch.delete(d.ref)); await batch.commit(); deleted += page.size; } }

exports.moderateMessage = onCall(async request => {
  adminOnly(request); const roomId = text(request.data?.roomId, "roomId"); const messageId = text(request.data?.messageId, "messageId"); const reason = text(request.data?.reason, "reason");
  const ref = db.doc(`rooms/${roomId}/messages/${messageId}`); const message = await ref.get(); if (!message.exists) throw new HttpsError("not-found", "Message no longer exists.");
  const batch = db.batch(); batch.delete(ref); batch.set(db.collection("moderationLogs").doc(), { action: "delete_message", roomId, messageId, messageAuthor: message.data().uid || null, reason, moderatorUid: request.auth.uid, createdAt: FieldValue.serverTimestamp() }); await batch.commit(); return { ok: true };
});
exports.deleteUser = onCall(async request => {
  adminOnly(request); const uid = text(request.data?.uid, "uid"); if (uid === request.auth.uid) throw new HttpsError("failed-precondition", "You cannot delete your own account.");
  const target = await getAuth().getUser(uid).catch(() => null); if (!target) throw new HttpsError("not-found", "User does not exist.");
  if (target.customClaims?.admin) { let pageToken; let admins = 0; do { const page = await getAuth().listUsers(1000, pageToken); admins += page.users.filter(u => u.customClaims?.admin).length; pageToken = page.pageToken; } while (pageToken); if (admins <= 1) throw new HttpsError("failed-precondition", "The final administrator cannot be deleted."); }
  await deleteQuery(db.collection("memberships").where("uid", "==", uid)); await deleteQuery(db.collectionGroup("messages").where("uid", "==", uid)); await db.doc(`users/${uid}`).delete(); await getAuth().deleteUser(uid);
  await db.collection("moderationLogs").add({ action: "delete_user", targetUid: uid, moderatorUid: request.auth.uid, createdAt: FieldValue.serverTimestamp() }); return { ok: true };
});
exports.deleteRoom = onCall(async request => {
  adminOnly(request); const roomId = text(request.data?.roomId, "roomId");
  if (roomId === "general") throw new HttpsError("failed-precondition", "The General room cannot be deleted.");
  const roomRef = db.doc(`rooms/${roomId}`); const room = await roomRef.get();
  if (!room.exists) throw new HttpsError("not-found", "Room no longer exists.");
  const deletedMessages = await deleteQuery(roomRef.collection("messages"));
  const deletedMemberships = await deleteQuery(db.collection("memberships").where("roomId", "==", roomId));
  await roomRef.delete();
  await db.collection("moderationLogs").add({ action: "delete_room", roomId, moderatorUid: request.auth.uid, deletedMessages, deletedMemberships, outcome: "success", createdAt: FieldValue.serverTimestamp() });
  return { ok: true, deletedMessages, deletedMemberships };
});
