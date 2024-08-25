import React, { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { IconButton } from "@mui/material";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import GroupAddRoundedIcon from "@mui/icons-material/GroupAddRounded";
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import NightlightRoundedIcon from "@mui/icons-material/NightlightRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
import axios from "axios";
import { myContext } from "./MainContainer";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import classNames from "classnames";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const { refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));

  
  useEffect(() => {
    // Check if userData and token are available
    if (userData?.token) {
      const config = {
        headers: { Authorization: `Bearer ${userData.token}` },
      };

      // Perform the data fetching
      axios
        .get("https://chat-app-backend-eta-five.vercel.app/chat/", config)
        .then((response) => {
          setConversations(response.data);
        })
        .catch((error) => {
          console.error("Error fetching conversations:", error);
        });
    }
  }, [refresh, userData]); 
  
  if (!userData) {
    navigate("/");
    return null;
  }

  const filteredConversations = conversations.filter(
    (convo) => convo.users.length > 1
  );

  return (
    <div className="sidebar">
      <div className={classNames("sb-header rounded", { dark: !lightTheme })}>
        <IconButton onClick={() => navigate("/app/welcome")}>
          <AccountCircleRoundedIcon
            className={classNames("icon", { dark: !lightTheme })}
          />
        </IconButton>
        <div className="sb-header-right">
          <IconButton onClick={() => navigate("/app/users")}>
            <PersonAddRoundedIcon
              className={classNames("icon", { dark: !lightTheme })}
            />
          </IconButton>
          <IconButton onClick={() => navigate("/app/groups")}>
            <GroupAddRoundedIcon
              className={classNames("icon", { dark: !lightTheme })}
            />
          </IconButton>
          <IconButton onClick={() => navigate("/app/create-groups")}>
            <AddCircleRoundedIcon
              className={classNames("icon", { dark: !lightTheme })}
            />
          </IconButton>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {lightTheme ? (
              <NightlightRoundedIcon />
            ) : (
              <LightModeIcon className="icon dark" />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              localStorage.removeItem("userData");
              navigate("/");
            }}
          >
            <ExitToAppIcon
              className={classNames("icon", { dark: !lightTheme })}
            />
          </IconButton>
        </div>
      </div>
      <div className={classNames("sb-search rounded", { dark: !lightTheme })}>
        <IconButton>
          <SearchRoundedIcon
            className={classNames("icon", { dark: !lightTheme })}
          />
        </IconButton>
        <input
          type="text"
          placeholder="Search"
          className={classNames("search-box", { dark: !lightTheme })}
        />
      </div>
      <div
        className={classNames("sb-conversations rounded", {
          dark: !lightTheme,
        })}
      >
        {filteredConversations.map((conversation) => (
          <div
            key={conversation._id}
            className="convo-container"
            onClick={() => {
              navigate(
                `chat/${conversation._id}&${conversation.users[1].name}`
              );
            }}
          >
            <p className={classNames("con-icon", { dark: !lightTheme })}>
              {conversation.users[1].name[0]}
            </p>
            <p className={classNames("con-title", { dark: !lightTheme })}>
              {conversation.users[1].name}
            </p>
            {conversation.latestMessage ? (
              <p className="con-lastMessage">
                {conversation.latestMessage.content}
              </p>
            ) : (
              <p className="con-lastMessage">
                No previous Messages, click here to start a new chat
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
