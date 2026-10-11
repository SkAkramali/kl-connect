import React from "react";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Avatar from "./Avatar";

const NavBar = ({ isAdmin, view, onViewChange, isLanding, adminSetupRequired }) => {
  const [user] = useAuthState(auth);

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const signOut = () => {
    auth.signOut();
  };

  return (
    <nav className={`nav-bar ${isLanding ? "nav-bar--landing" : ""}`}>
      <div className="nav-bar__left">
        <h1>KL Connect</h1>
      </div>
      {user ? (
        <div className="nav-actions">
          <button className={`nav-tab ${view === "chat" ? "nav-tab--active" : ""}`} onClick={() => onViewChange("chat")} type="button">Chats</button>
          {isAdmin && <button className={`nav-tab ${view === "admin" ? "nav-tab--active" : ""}`} onClick={() => onViewChange("admin")} type="button">Admin</button>}
          <Avatar
            photoURL={user.photoURL}
            name={user.displayName}
            size={32}
            className="nav-bar__avatar"
          />
          <button onClick={signOut} className="sign-out" type="button">Sign Out</button>
        </div>
      ) : (
        <div className="landing-nav-links"><a href="#home">Home</a><a href="#features">Features</a><a href="#about">About</a><button className="landing-nav-signin" type="button" onClick={googleSignIn}>Sign in</button><button className="landing-nav-start" type="button" onClick={googleSignIn}>Get started</button></div>
      )}
      {adminSetupRequired && <p className="admin-setup-note">Admin setup required: sign out and back in after the custom claim is granted.</p>}
    </nav>
  );
};

export default NavBar;
