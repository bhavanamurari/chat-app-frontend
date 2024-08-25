import React, { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import chat from "../images/chat.png";
import { IconButton } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, anticipate, motion } from "framer-motion";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Groups = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const { refresh, setRefresh } = useContext(myContext);
   const dispatch = useDispatch();
   const [groups, SetGroups] = useState([]);
   const userData = JSON.parse(localStorage.getItem("userData"));
   // console.log("Data from LocalStorage : ", userData);
   const nav = useNavigate();
    useEffect(() => {
      if (!userData) {
        console.log("User not Authenticated");
        nav(-1);
        return;
      }
    }, [userData, nav]);
  
    // const user = userData.data;
    useEffect(() => {
      console.log("Users refreshed : ", userData.token);
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };

      axios
        .get(
          "https://chat-app-backend-eta-five.vercel.app/chat/fetchGroups",
          config
        )
        .then((response) => {
          console.log("Group Data from API ", response.data);
          SetGroups(response.data);
        });
    }, [refresh]);
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ ease: "anticipate", duration: "0.3" }}
        className="list-container"
      >
        <div className="ug-header rounded d-flex justify-content-between">
          <div className="d-flex gap-2">
            <img
              src={chat}
              alt="logo"
              style={{ height: "2rem", width: "2rem" }}
            />
            <div className="ug-title text-dark m-2">Available Groups</div>
          </div>

          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </div>
        <div className={"sb-search1 rounded" + (lightTheme ? "" : " dark")}>
          <IconButton>
            <SearchRoundedIcon
              className={"icon" + (lightTheme ? "" : " dark")}
            />
          </IconButton>
          <input
            type="text"
            placeholder="Search"
            className={"search-box" + (lightTheme ? "" : " dark")}
          />
        </div>
        <div className="ug-list">
          {groups.map((group, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={"list-item" + (lightTheme ? "" : " dark")}
                key={index}
                onClick={() => {
                  console.log("Creating chat with group", group.name);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.token}`,
                    },
                  };
                  axios.post(
                    "https://chat-app-backend-eta-five.vercel.app/chat/",
                    {
                      userId: group._id,
                    },
                    config
                  );
                  dispatch(refreshSidebarFun());
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>{group.chatName[0]}</p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {group.chatName}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Groups;
