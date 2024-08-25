import React, { useContext, useEffect, useRef, useState } from 'react'
import "./myStyles.css";
import { IconButton, Skeleton } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import MessageOthers from './MessageOthers';
import MessageSelf from './MessageSelf';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import axios from "axios";
import { myContext } from "./MainContainer";
import  io  from "socket.io-client";

const ENDPOINT =
  "https://vercel.com/bhavanas-projects-5b466d0f/chat-app-backend";

const ChatArea = () => {
  const navigate = useNavigate();
  const lightTheme = useSelector((state) => state.themeKey);
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef(null);
  const dyParams = useParams();
  const [chat_id, chat_user] = dyParams._id.split("&");
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [allMessages, setAllMessages] = useState([]);
   const [allMessagesCopy, setAllMessagesCopy] = useState([]);
  const { refresh, setRefresh } = useContext(myContext);
  const [loaded, setloaded] = useState(false);
  const [socketConnectionStatus, setSocketConnectionStatus] = useState(false);
const socket = io(ENDPOINT);
    useEffect(() => {
      socket.emit("setup", userData);
      socket.on("connection", () => {
        setSocketConnectionStatus(!socketConnectionStatus);
      });
    }, []);

  const sendMessage = () => {
    // console.log("SendMessage Fired to", chat_id._id);
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    axios
      .post(
        "https://vercel.com/bhavanas-projects-5b466d0f/chat-app-backend/message/",
        {
          content: messageContent,
          chatId: chat_id,
        },
        config
      )
      .then(({ data }) => {
        console.log("Message Fired");
        setMessageContent(""); // Clear the input after sending
        socket.emit("newMessage", data);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

  };
  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };
//connect to socket

  //new message received
  useEffect(() => {
    socket.on("message received", (newMessage) => {
      if (!allMessagesCopy || allMessagesCopy._id !== newMessage._id) {
      //setAllMessages([...allMessages], newMessage);
      } else {
        setAllMessages([...allMessages], newMessage);
    }
  })
})

  //fetch Chats
  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };
    axios
      .get(
        "https://vercel.com/bhavanas-projects-5b466d0f/chat-app-backend/message/" +
          chat_id,
        config
      )
      .then(({ data }) => {
        setAllMessages(data);
        setloaded(true);
        socket.emit("join chat", chat_id);
        // console.log("Data from Acess Chat API ", data);
      });
    setAllMessagesCopy(allMessages);
  }, [refresh, chat_id, userData.token, allMessages]);
 const deleteChat = () => {
   const config = {
     headers: {
       Authorization: `Bearer ${userData.token}`,
     },
   };
   axios
     .delete(
       `https://vercel.com/bhavanas-projects-5b466d0f/chat-app-backend/chat/${chat_id}`,
       config
     )
     .then(() => {
       console.log("Chat deleted");
       setAllMessages([]);
       navigate(-1); // Navigate to another route, e.g., home
     })
     .catch((error) => {
       console.error("Error deleting chat:", error);
     });
 };

  // useEffect(() => {
  //   console.log("Users refreshed");
  //   const config = {
  //     headers: {
  //       Authorization: `Bearer ${userData.token}`,
  //     },
  //   };
  //   axios
  //     .get("http://localhost:8080/message/" + chat_id, config)
  //     .then(({ data }) => {
  //       setAllMessages(data);
  //       setloaded(true);
  //       // console.log("Data from Acess Chat API ", data);
  //     });
  //   // scrollToBottom();
  // }, [refresh, chat_id, userData.token]);

  if (!loaded) {
    return (
      <div
        style={{
          border: "20px",
          padding: "10px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            width: "100%",
            borderRadius: "10px",
            flexGrow: "1",
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{ width: "100%", borderRadius: "10px" }}
          height={60}
        />
      </div>
    );
  } else {
    return (
      <div className="chatarea">
        <div className={"chatArea-header" + (lightTheme ? "" : " dark")}>
          <div className="side-header d-flex gap-3">
            <p className="con-icon">{chat_user[0]}</p>
            <div className="header-text">
              <p className={"con-title mt-2" + (lightTheme ? "" : " dark")}>
                {chat_user}
              </p>
              {/* <p className={"con-timeStamp" + (lightTheme ? "" : " dark")}>
                {props.timeStamp}
              </p> */}
            </div>
          </div>
          <div>
            <IconButton onClick={deleteChat}>
              <DeleteIcon className={"icon" + (lightTheme ? "" : " dark")} />
            </IconButton>
          </div>
        </div>
        <div className={"msg-container" + (lightTheme ? "" : " dark")}>
          {allMessages
            .slice(0)
            .reverse()
            .map((message, index) => {
              const sender = message.sender;
              const self_id = userData._id;
              if (sender._id === self_id) {
                // console.log("I sent it ");
                return <MessageSelf props={message} key={index} />;
              } else {
                // console.log("Someone Sent it");
                return <MessageOthers props={message} key={index} />;
              }
            })}
        </div>
        <div ref={messagesEndRef} className="BOTTOM" />
        <div className={"text-input-area" + (lightTheme ? "" : " dark")}>
          <input
            type="text"
            placeholder="Type a Message"
            className={"search-box" + (lightTheme ? "" : " dark")}
            value={messageContent}
            onChange={(e) => {
              setMessageContent(e.target.value);
            }}
            onKeyDown={(event) => {
              if (event.code == "Enter") {
                // console.log(event);
                event.preventDefault();
                sendMessage();
                setMessageContent("");
                setRefresh(!refresh);
              }
            }}
          />
          <IconButton
            onClick={() => {
              sendMessage();
            }}
          >
            <SendIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
        </div>
      </div>
    );
  }
}

export default ChatArea;