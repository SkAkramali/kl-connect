import "./App.css";
import NavBar from "./components/NavBar";
import ChatBox from "./components/ChatBox";
import Welcome from "./components/Welcome";
import RoomsListPanel from "./components/RoomsListPanel";
import RoomsActionsPanel from "./components/RoomsActionsPanel";
import { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [view, setView] = useState("chat");
  const [activeRoom, setActiveRoom] = useState({
    id: "general",
    name: "General",
    isPrivate: false,
  });

  // Ensure the "general" room exists in Firestore once the user is signed in.
  // Gated on `user` because Firestore rules require auth — running this before
  // sign-in would be denied with "Missing or insufficient permissions".
  useEffect(() => {
    if (!user) return;

    user.getIdTokenResult().then(result => setIsAdmin(result.claims.admin === true));
    const profileRef = doc(db, "users", user.uid);
    getDoc(profileRef).then(profile => setDoc(profileRef, {
      displayName: user.displayName || "KL Connect student",
      photoURL: user.photoURL || null,
      email: user.email || null,
      ...(profile.exists() ? {} : { createdAt: serverTimestamp() }),
      lastActiveAt: serverTimestamp(),
    }, { merge: true })).catch(console.error);

    const ensureGeneralRoom = async () => {
      const generalRef = doc(db, "rooms", "general");
      const generalSnap = await getDoc(generalRef);
      if (!generalSnap.exists()) {
        await setDoc(generalRef, {
          name: "General",
          isPrivate: false,
          createdAt: serverTimestamp(),
          createdBy: "system",
        });
      } else {
        const data = generalSnap.data();
        setActiveRoom(prev => ({
          ...prev,
          name: data.name || "General",
          isPrivate: Boolean(data.isPrivate),
        }));
      }
    };

    ensureGeneralRoom();
  }, [user]);

  useEffect(() => {
    if (!user) { setIsAdmin(false); setView("chat"); }
  }, [user]);

  // Which side panel is open as a drawer on small screens: "rooms" | "actions" | null.
  // On phones, start with the conversation list just like a messaging app.
  const [openPanel, setOpenPanel] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 980 ? "rooms" : null,
  );

  const handleSelectRoom = room => {
    setActiveRoom(room);
    setOpenPanel(null); // close the drawer after picking a room on mobile
  };

  return (
    <div className="App">
      <NavBar isAdmin={isAdmin} view={view} onViewChange={setView} isLanding={!user} adminSetupRequired={user?.email === "naseemaarsha02@gmail.com" && !isAdmin} />
      {!user ? (
        <Welcome />
      ) : view === "admin" && isAdmin ? (
        <AdminDashboard onBackToChat={() => setView("chat")} />
      ) : (
        <div className="app-shell">
          <div className="panel-toggles">
            <button
              type="button"
              className="panel-toggle"
              onClick={() => setOpenPanel("rooms")}>
              ☰ Rooms
            </button>
            <button
              type="button"
              className="panel-toggle"
              onClick={() => setOpenPanel("actions")}>
              + Create &amp; Join
            </button>
          </div>

          <RoomsListPanel
            activeRoomId={activeRoom.id}
            onSelectRoom={handleSelectRoom}
            isOpen={openPanel === "rooms"}
            onClose={() => setOpenPanel(null)}
          />
          <ChatBox activeRoom={activeRoom} />
          <RoomsActionsPanel
            onSelectRoom={handleSelectRoom}
            isOpen={openPanel === "actions"}
            onClose={() => setOpenPanel(null)}
          />

          {openPanel && (
            <div
              className="panel-overlay"
              onClick={() => setOpenPanel(null)}
              aria-hidden="true"
            />
          )}
        </div>
      )}
      {user && <footer className="app-footer">
        <a
          href="https://tech.timonwa.com/blog/create-multi-room-chat-app-using-react-firebase"
          target="_blank"
          rel="noreferrer">
          Read the tutorial
        </a>{" "}
        ·{" "}
        <a
          href="https://github.com/Timonwa/react-chat"
          target="_blank"
          rel="noreferrer">
          ⭐ Star on GitHub
        </a>{" "}
        ·{" "}
        Built by{" "}
        <a href="https://links.timonwa.com" target="_blank" rel="noreferrer">
          Timonwa
        </a>
      </footer>}
    </div>
  );
}

export default App;
