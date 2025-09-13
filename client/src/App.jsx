import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Chatbox from "./components/Chatbox";
import Community from "./pages/Community";
import Crediet from "./pages/Crediet";
import Sidebare from "./components/Sidebare";
import { assets } from "./assets/assets";
import "./assets/prism.css";
import Loading from "./pages/Loading";
import { useAppContext } from "./context/Appcontext";
import Login from "./pages/Login";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { user,loadUser } = useAppContext();
  const [ismenuOpen, setIsmenuOpen] = useState(false);
  const { pathname } = useLocation();

  if (pathname === "/loading" ||loadUser) return <Loading />;

  return (
    <>
      {!ismenuOpen && (
        <img
          src={assets.menu_icon}
          className="absolute top-3 left-3 w-5 h-5 cursor-pointer
    md:hidden not-dark:invert"
          onClick={() => setIsmenuOpen(true)}
        />
      )}
      <div
        className="dark:bg-gradient-to-b from-[#242124] to-[#000000]
    dark:text-white"
      >
        {user ? (
          <div className="flex h-screen w-screen">
            <Sidebare isMenuOpen={ismenuOpen} setIsMenuOpen={setIsmenuOpen} />
            <Routes>
              <Route path="/" element={<Chatbox />} />
              <Route path="/community" element={<Community />} />

              <Route path="/credits" element={<Crediet />} />
            </Routes>
          </div>
        ) : (
          <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
            <Login />
          </div>
        )}
      </div>
      <Toaster/>
    </>
  );
};

export default App;
