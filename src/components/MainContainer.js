import React, { createContext, useState } from 'react'
import './myStyles.css';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';
import Welcome from './Welcome';
import CreateGroups from './CreateGroups';
import Users from './Users';
import Groups from './Groups';
import { Outlet } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';


export const myContext = createContext();

const MainContainer = () => {
    const dispatch = useDispatch();
    const lightTheme = useSelector((state) => state.themeKey);
  const [refresh, setRefresh] = useState(true);
  
  return (
    <div className={"main-container rounded" + (lightTheme ? "" : " dark")}>
      <myContext.Provider value={{ refresh: refresh, setRefresh: setRefresh }}>
        <Sidebar />
        <Outlet />
      </myContext.Provider>
      {/* <Welcome /> */}
      {/* <CreateGroups /> */}
      {/* <ChatArea props={conversations[0]} /> */}
      {/* <Users /> */}
      {/* <Groups /> */}
    </div>
  );
}

export default MainContainer