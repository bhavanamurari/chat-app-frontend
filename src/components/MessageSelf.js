import React from 'react'
import { useSelector } from "react-redux";
// import { format } from "date-fns";

const MessageSelf = ({props}) => {
    const lightTheme = useSelector((state) => state.themeKey);
  console.log("Message Props:", props);
//  const now = new Date();
//  const formattedCurrentTime = format(now, "hh:mm a");
  return (
    <div className="self-msg-container">
      <div className="messageBox">
        <p className={"" + (lightTheme ? "" : " text-dark")}>{props.content}</p>
        {/* <small className={"self-timeStamp" + (lightTheme ? "" : " text-dark")}>
          {formattedCurrentTime}
        </small> */}
      </div>
    </div>
  );
}

export default MessageSelf