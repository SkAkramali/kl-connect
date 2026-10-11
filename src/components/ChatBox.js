import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message";
import SendMessage from "./SendMessage";
import CopyCode from "./CopyCode";

const ChatBox = ({ activeRoom }) => {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const messagesRef = useRef(null);

  const roomLabel = useMemo(() => {
    if (!activeRoom?.name) {
      return "Select a room";
    }
    return `${activeRoom.name}${activeRoom.isPrivate ? " · Private" : ""}`;
  }, [activeRoom]);

  useEffect(() => {
    if (!activeRoom?.id) {
      setMessages([]);
      setStatus("idle");
      return undefined;
    }
    setStatus("loading"); setError("");

    const q = query(
      collection(db, "rooms", activeRoom.id, "messages"),
      orderBy("createdAt", "desc"),
      limit(50),
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const fetchedMessages = snapshot.docs
        .map(docSnapshot => ({
          ...docSnapshot.data(),
          id: docSnapshot.id,
        }))
        .reverse();
      setMessages(fetchedMessages);
      setStatus("ready");
    }, listenerError => { setError("Messages could not be loaded. Please try again."); setStatus("error"); });

    return () => unsubscribe();
  }, [activeRoom?.id]);

  useEffect(() => {
    // Scroll the message list itself to the bottom — not the whole window.
    const el = messagesRef.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  return (
    <main className="chat-box">
      <header className="chat-box__header">
        <div>
          <h2>{roomLabel}</h2>
          <p>Share updates and keep the conversation moving.</p>
        </div>
        {activeRoom?.isPrivate && activeRoom?.joinCode && (
          <div className="chat-box__code">
            <span className="chat-box__code-label">Room code</span>
            <CopyCode code={activeRoom.joinCode} />
          </div>
        )}
      </header>
      <div className="messages-wrapper" ref={messagesRef}>
        {status === "loading" ? <div className="messages-empty"><p>Loading conversation…</p></div> : error ? <div className="messages-empty messages-empty--error"><p>{error}</p></div> : messages.length ? (
          messages.map(message => (
            <Message key={message.id} message={message} />
          ))
        ) : (
          <div className="messages-empty">
            <p>No messages yet. Be the first to start the conversation.</p>
          </div>
        )}
      </div>
      <SendMessage roomId={activeRoom?.id} />
    </main>
  );
};

export default ChatBox;
