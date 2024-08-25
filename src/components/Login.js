import React, { useEffect, useState } from "react";
import chat from "../images/chat.png";
import { TextField, Button, Backdrop, CircularProgress } from "@mui/material";
import "./myStyles.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [signUpStatus, setSignUpStatus] = useState(null);

  const navigate = useNavigate();

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const loginHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post(
        "https://vercel.com/bhavanas-projects-5b466d0f/chat-app-backend/user/login",
        data,
        config
      );
      console.log("Login response: ", response); // Debugging
      setLoginStatus({
        message: "Login Successful",
        type: "success",
      });
      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/app/welcome");
    } catch (error) {
      console.error("Login error: ", error); // Debugging
      if (error.response) {
        setLoginStatus({
          message: "Invalid Credentials",
          type: "error",
        });
      } else {
        setLoginStatus({
          message: "An unexpected error occurred",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const signUpHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const response = await axios.post(
        "https://vercel.com/bhavanas-projects-5b466d0f/chat-app-backend/user/register",
        data,
        config
      );
      console.log("SignUp response: ", response); // Debugging
      setSignUpStatus({
        message: "Sign up successful!",
        type: "success",
      });
      localStorage.setItem("userData", JSON.stringify(response.data));
      navigate("/app/welcome");
    } catch (error) {
      console.error("SignUp error: ", error); // Debugging
      if (error.response) {
        console.log("Error Status:", error.response.status);
        console.error("SignUp error details: ", error.response.data);

        if (error.response.status === 409) {
          setSignUpStatus({
            message: "User with this email already exists",
            type: "error",
          });
        } else if (error.response.status === 422) {
          setSignUpStatus({
            message: "User Name already taken, Please take another one",
            type: "error",
          });
        } else {
          setSignUpStatus({
            message: "An error occurred during sign up",
            type: "error",
          });
        }
      } else {
        setSignUpStatus({
          message: "An unexpected error occurred",
          type: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loginStatus) {
      const { message, type } = loginStatus;
      toast[type](message);
      setLoginStatus(null); // Reset loginStatus after showing the toast
    }
  }, [loginStatus]);

  useEffect(() => {
    if (signUpStatus) {
      const { message, type } = signUpStatus;
      toast[type](message);
      setSignUpStatus(null); // Reset signUpStatus after showing the toast
    }
  }, [signUpStatus]);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="secondary" />
      </Backdrop>
      <div className="login-container rounded">
        <div className="img-container">
          <img src={chat} alt="logo" className="welcome-img" />
        </div>
        {showLogin ? (
          <div className="login-box rounded">
            <h3 className="text-info">Login to your account</h3>
            <TextField
              id="login-name"
              label="Enter User Name"
              variant="outlined"
              onChange={changeHandler}
              color="secondary"
              name="name"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  loginHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="login-password"
              label="Enter Password"
              variant="outlined"
              type="password"
              color="secondary"
              name="password"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  loginHandler();
                }
              }}
            />
            <Button variant="outlined" color="secondary" onClick={loginHandler}>
              Login
            </Button>
            <div className="d-flex gap-2">
              <p>Don't have an Account ?</p>
              <span
                className="login_signup"
                onClick={() => {
                  setShowLogin(false);
                }}
              >
                Sign Up
              </span>
            </div>
          </div>
        ) : (
          <div className="login-box rounded">
            <h3 className="text-info">Create your account</h3>
            <TextField
              id="signup-name"
              label="Enter User Name"
              variant="outlined"
              onChange={changeHandler}
              color="secondary"
              name="name"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  signUpHandler();
                }
              }}
            />
            <TextField
              id="signup-email"
              label="Enter Email Address"
              variant="outlined"
              onChange={changeHandler}
              color="secondary"
              name="email"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  signUpHandler();
                }
              }}
            />
            <TextField
              onChange={changeHandler}
              id="signup-password"
              label="Enter Password"
              variant="outlined"
              type="password"
              color="secondary"
              name="password"
              onKeyDown={(event) => {
                if (event.code == "Enter") {
                  // console.log(event);
                  signUpHandler();
                }
              }}
            />
            <Button
              variant="outlined"
              color="secondary"
              onClick={signUpHandler}
            >
              Sign Up
            </Button>
            <div className="d-flex gap-2">
              <p>Already have an Account ?</p>
              <span
                className="login_signup"
                onClick={() => {
                  setShowLogin(true);
                }}
              >
                Login
              </span>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
 