import React, { useContext, useEffect, useState } from 'react'
import './myStyles.css';
import chat from "../images/chat.png";
import { IconButton } from '@mui/material';
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useDispatch, useSelector } from 'react-redux';
import RefreshIcon from "@mui/icons-material/Refresh";
import { AnimatePresence} from 'framer-motion';
import { motion } from 'framer-motion';
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

const Users = () => {
   const { refresh, setRefresh } = useContext(myContext);

   const lightTheme = useSelector((state) => state.themeKey);
   const [users, setUsers] = useState([]);
   const userData = JSON.parse(localStorage.getItem("userData"));
   // console.log("Data from LocalStorage : ", userData);
   const nav = useNavigate();
   const dispatch = useDispatch();

  useEffect(() => {
    if (!userData) {
      console.log("User not Authenticated");
      nav(-1);
      return;
    }
  }, [userData, nav]);

  useEffect(() => {
      if (!userData) return;
      console.log("Users refreshed");
      const config = {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      };
      axios
        .get(
          "https://vercel.com/bhavanas-projects-5b466d0f/chat-app-backend/user/fetchUsers",
          config
        )
        .then((data) => {
          console.log("UData refreshed in Users panel ");
          setUsers(data.data);
          // setRefresh(!refresh);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        });
    }, [refresh, userData]);

   const handleRefresh = () => {
     setRefresh((prevRefresh) => !prevRefresh);
  };
  
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
          <div className='d-flex gap-2'>
            <img
              src={chat}
              alt="logo"
              style={{ height: "2rem", width: "2rem" }}
            />
            <div className="ug-title text-dark mt-2">Available Users</div>
          </div>
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={handleRefresh}
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
          {users.map((user, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={"list-item" + (lightTheme ? "" : " dark")}
                key={index}
                onClick={() => {
                  console.log("Creating chat with ", user.name);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${userData.token}`,
                    },
                  };
                  axios
                    .post(
                      "https://vercel.com/bhavanas-projects-5b466d0f/chat-app-backend/chat/",
                      {
                        userId: user._id,
                      },
                      config
                    )
                    .then((response) => {
                      console.log("Chat created successfully:", response.data);
                    })
                    .catch((error) => {
                      if (error.response) {
                        // Server responded with a status other than 2xx
                        console.error("Error data:", error.response.data);
                        console.error("Error status:", error.response.status);
                        console.error(
                          "Error status text:",
                          error.response.statusText
                        );
                        console.error("Error headers:", error.response.headers);
                      } else if (error.request) {
                        // No response was received from the server
                        console.error("Error request:", error.request);
                      } else {
                        // Something else triggered the error
                        console.error("Error message:", error.message);
                      }
                    });
                }}
              >
                <p className="con-icon">T</p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {user.name}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Users;