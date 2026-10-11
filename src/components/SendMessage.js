import React, { useState } from "react";
import { auth, db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const SendMessage = ({ roomId }) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async event => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || !roomId || isSending) return;
    setIsSending(true); setError("");
    try {
      const { uid, displayName, photoURL } = auth.currentUser;
      await addDoc(collection(db, "rooms", roomId, "messages"), { text: trimmed, name: displayName, avatar: photoURL, createdAt: serverTimestamp(), uid });
      setMessage("");
    } catch (sendError) {
      setError("Message could not be sent. Check your connection and try again.");
    } finally { setIsSending(false); }
  };
  return (
    <form onSubmit={event => sendMessage(event)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <textarea
        id="messageInput"
        name="messageInput"
        placeholder={roomId ? "Write a message…" : "Choose a room to start chatting"}
        value={message}
        onChange={e => setMessage(e.target.value)}
        onKeyDown={event => {
          if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(event); }
        }}
        maxLength={500}
        disabled={!roomId || isSending}
      />
      <div className="composer-actions"><span>{message.length}/500</span><button type="submit" disabled={!roomId || !message.trim() || isSending}>
        {isSending ? "Sending…" : "Send"}
      </button>
      </div>
      {error && <p className="send-message__error" role="alert">{error}</p>}
    </form>
  );
};

export default SendMessage;
