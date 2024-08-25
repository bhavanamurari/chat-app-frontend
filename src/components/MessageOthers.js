import React from 'react'
import "./myStyles.css";
import { useDispatch, useSelector } from "react-redux";
// import { format } from "date-fns";

const MessageOthers = ({ props }) => {
   const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
    //  const now = new Date();
    //  const formattedCurrentTime = format(now, "hh:mm a");
  return (
    <div className="other-msg-container">
      <div className="convo-container">
        <p className="con-icon">{props.sender.name[0]}</p>
        <div className="other-text-content">
          <p className="con-title ">{props.sender.name}</p>
          <p className={"con-lastMessage" + (lightTheme ? "" : " text-dark")}>
            {props.content}
          </p>
          {/* <small
            className={"self-timeStamp" + (lightTheme ? "" : " text-dark")}
          >
            {formattedCurrentTime}
          </small> */}
        </div>
      </div>
    </div>
  );
}

export default MessageOthers