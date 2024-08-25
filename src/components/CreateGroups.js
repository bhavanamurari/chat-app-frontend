import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React, {useState} from "react";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { useDispatch, useSelector } from "react-redux";
import { create } from "@mui/material/styles/createTransitions";
import { useNavigate } from "react-router";
import axios from "axios";

const CreateGroups = () => {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  // console.log("Data from LocalStorage : ", userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  // const user = userData.data;
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  console.log("User Data from CreateGroups : ", userData);

  const createGroup = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    };

    axios.post(
      "https://vercel.com/bhavanas-projects-5b466d0f/chat-app-backend/chat/createGroup",
      {
        name: groupName,
        users: '["647d94aea97e40a17278c7e5","647d999e4c3dd7ca9a2e6543"]',
      },
      config
    );
    nav("/app/groups");
  };

  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to create a Group Named " + groupName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will create a create group in which you will be the admin and
              other will be able to join this group.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                createGroup();
                handleClose();
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div
        className={
          "createGroups-container rounded" + (lightTheme ? "" : " dark")
        }
      >
        <input
          placeholder="Enter Group Name"
          className={"search-box" + (lightTheme ? "" : " dark")}
          onChange={(e) => {
            setGroupName(e.target.value);
          }}
        />
        <IconButton
          className={"icon" + (lightTheme ? "" : " dark")}
          onClick={() => {
            handleClickOpen();
            // createGroup();
          }}
        >
          <DoneOutlineIcon />
        </IconButton>
      </div>
    </>
  );
  // return (
  //   <div
  //     className={
  //       "createGroups-container  rounded" + (lightTheme ? "" : " dark")
  //     }
  //   >
  //     <input
  //       type="text"
  //       placeholder="Enter Group Name"
  //       className={"search-box" + (lightTheme ? "" : " dark")}
  //     />
  //     <IconButton>
  //       <DoneOutlineIcon className={"icon" + (lightTheme ? "" : " dark")} />
  //     </IconButton>
  //   </div>
  // );
};

export default CreateGroups;
