import React from "react";
import { auth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Welcome = () => {
  const googleSignIn = () => signInWithPopup(auth, new GoogleAuthProvider());
  const scrollToFeatures = () => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });

  return (
    <main className="landing-page">
      <section className="landing-hero" id="home"><div className="landing-copy"><p className="landing-kicker">KL CONNECT · CAMPUS COMMUNICATION</p><h2>Your Campus. Your Conversations. Connected.</h2><p className="landing-lede">A smarter place for students to connect, collaborate, and stay in sync with their campus community.</p><div className="landing-cta"><button className="landing-primary" onClick={googleSignIn}>Get started</button><button className="landing-secondary" onClick={scrollToFeatures}>Explore features</button></div><p className="landing-note">Sign in securely with your Google account to join the conversation.</p></div><div className="landing-preview" aria-label="KL Connect chat preview"><div className="preview-top"><span className="preview-mark">K</span><span><b>Design Studio</b><small>8 members</small></span><i>•••</i></div><div className="preview-thread"><div className="preview-message"><b>Anika</b><p>Are we ready for tomorrow's review?</p><small>10:24 AM</small></div><div className="preview-message preview-message--own"><p>Almost there — sharing the final notes now.</p><small>10:26 AM</small></div><div className="preview-message"><b>Rahul</b><p>Great, I’ll add the presentation link.</p><small>10:27 AM</small></div></div><div className="preview-compose">Write a message <span>➤</span></div></div></section>
      <section className="landing-section" id="features"><p className="landing-kicker">BUILT FOR THE CAMPUS DAY</p><h2>Everything you need to stay in the loop.</h2><div className="feature-grid"><article><span>↯</span><h3>Real-time messaging</h3><p>Keep conversations moving with live room updates.</p></article><article><span>⌁</span><h3>Public & private rooms</h3><p>Collaborate openly or use an invite code for focused discussions.</p></article><article><span>✓</span><h3>Secure sign-in</h3><p>Use Google Authentication to access your campus conversations.</p></article><article><span>◫</span><h3>Ready everywhere</h3><p>A responsive workspace that adapts to phones, tablets, and desktops.</p></article></div></section>
      <section className="landing-section landing-how" id="about"><p className="landing-kicker">HOW IT WORKS</p><h2>Start a meaningful conversation in three steps.</h2><div className="steps"><article><b>01</b><h3>Sign in securely</h3><p>Use your existing Google account to get started.</p></article><article><b>02</b><h3>Find your room</h3><p>Join a public conversation or enter a private room code.</p></article><article><b>03</b><h3>Collaborate</h3><p>Share updates and stay connected with classmates.</p></article></div></section>
      <section className="landing-final"><div><p className="landing-kicker">READY WHEN YOU ARE</p><h2>Join your campus conversation.</h2></div><button className="landing-primary" onClick={googleSignIn}>Get started</button></section>
      <footer className="landing-footer"><b>KL Connect</b><span>Built for campus conversations.</span><a href="#home">Home</a><a href="#features">Features</a><a href="#about">About</a></footer>
    </main>
  );
};

export default Welcome;
