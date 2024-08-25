import React, { useEffect } from 'react';
import chat from '../images/chat.png';
import { useNavigate } from 'react-router';
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const Welcome = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  console.log(userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  useEffect(() => {
    if (!userData) {
      console.log("User not Authenticated");
      nav("/");
    }
  }, [userData, nav]);

    if (!userData) {
      return null; // Or a loading spinner / message
    }

  return (
    <div className="welcome-container rounded">
      <motion.img
        drag
        whileTap={{ scale: 1.05, rotate: 360 }}
        src={chat}
        alt="logo"
        className="welcome-img"
      />
      <b className="text-dark">Hi, {userData.name}</b>
      <small className="text-dark">
        View and text directly to people present in the chat rooms.
      </small>
    </div>
  );
}

export default Welcome