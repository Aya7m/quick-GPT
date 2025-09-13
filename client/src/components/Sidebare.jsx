import React, { useState } from "react";
import { useAppContext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import moment from "moment/moment";
import toast from "react-hot-toast";
import axios from "axios";

const Sidebar = ({isMenuOpen, setIsMenuOpen}) => {
  const { chats, setSelectChat, theme, navigate, user, setTheme,createNewChat,loadUser,setChats,fetchUserChats,setToken,token } =
    useAppContext();
  const [search, setSearch] = useState("");
  console.log("Search icon path:", assets.search_icon);

  // logout function
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");

  };
  // delete chat function
 
  const handleDeleteChat = async (e,chatId) => {
  e.stopPropagation();
  const confirm = window.confirm("Are you sure you want to delete this chat?");
  if(!confirm) return;
  try {
    const res = await axios.delete(`/api/chat/delete`, {
      data: { chatId },
      headers: { Authorization: token }
    });

    if(res?.data.success){
      toast.success(res.data.message);
      setChats(chats.filter((chat) => chat._id !== chatId));
      await fetchUserChats();
    }else{
      toast.error(res.data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
}


  return (
    <div
      className={`flex flex-col h-screen min-w-72 p-5
      dark:bg-gradient-to-b from-[#242124]/30 to-[#000000]/30 border-r border-[#80699F]/30
      backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-10 ${!isMenuOpen && 'max-md:translate-x-full'}`}
    >
      {/* logo */}
      <img
        src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
        alt="Logo"
        className="w-full max-w-48"
      />

      {/* new chat box */}
      <button onClick={createNewChat} className="flex items-center justify-center w-full mt-5 mb-3 p-3 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F6] rounded-lg hover:opacity-90 transition-opacity duration-300">
        <span className="mr-2 text-xl">+</span>New Chat
      </button>

      {/* search conversation */}

      <div
        className="flex items-center gap-2 p-3 mt-4 border border-gray-400
        dark:border-white/20 rounded-md"
      >
        <img
          src={assets.search_icon}
          alt="Search"
          className="w-4 h-4 not-dark:invert"
        />

        <input
          onChange={(e) => setSearch(e.target.value)}
          value={search}
          type="text"
          placeholder="Search Conversation"
          className="text-xs placeholder:text-gray-400 outline-none flex-1 bg-transparent"
        />
      </div>

      {/* recently chats */}
      {chats.length > 0 && <p className="mt-4 text-sm">Recent Chats</p>}

      <div className="flex-1 overflow-y-scroll mt-3 text-sm space-y-3">
        {chats
          .filter((chat) =>
            chat.messages[0]
              ? chat.messages[0]?.content
                  .toLowerCase()
                  .includes(search?.toLowerCase())
              : chat.name.toLowerCase().includes(search?.toLowerCase())
          )
          .map((chat) => (
            <div
              key={chat._id}
              className="flex justify-between items-center group relative p-2 px-4 dark:bg-[#57317C]/10 border border-gray-300 
              dark:border-[#80609F]/15 rounded-md hover:opacity-90 cursor-pointer transition-opacity duration-300"
              onClick={() =>{ navigate('/');setSelectChat(chat);setIsMenuOpen(false)}}
            >
              <div>
                <p className="truncate w-full">
                  {chat.messages.length > 0
                    ? chat.messages[0]?.content.slice(0, 32)
                    : chat.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
                  {moment(chat.updatedAt).fromNow()}
                </p>
              </div>

              {/* delete icon appears only on hover */}
              <img
                src={assets.bin_icon}
                alt="Delete"
                className="hidden group-hover:block w-4 cursor-pointer not-dark:invert"
                onClick={e => toast.promise(handleDeleteChat(e,chat._id),{
                  loading:"Deleting chat...",
                  success:"Chat deleted successfully",
                  error:"Failed to delete chat"
                })}
              />
            </div>
          ))}
      </div>

      {/* community images */}
      <div
        onClick={() => {
          navigate("/community")
        ;setIsMenuOpen(false)}}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-400
        dark:border-white/20 rounded-md cursor-pointer hover:scale-105 transition-opacity duration-300"
      >
        <img
          src={assets.gallery_icon}
          className="w-4.5 not-dark:invert"
          alt=""
        />
        <div className="flex flex-col text-sm">
          <p>Community Images</p>
        </div>
      </div>

      {/* crediets */}
      <div
        onClick={() => {
          navigate("/credits");setIsMenuOpen(false)
        }}
        className="flex items-center gap-2 p-3 mt-4 border border-gray-400
        dark:border-white/20 rounded-md cursor-pointer hover:scale-105 transition-opacity duration-300"
      >
        <img src={assets.diamond_icon} className="w-4.5 dark:invert" alt="" />
        <div className="flex flex-col text-sm">
          <p>Credies :{user?.credits}</p>
          <p className="text-xs text-gray-500 dark:text-[#B1A6C0]">
            Purchase credits to use quickGPT
          </p>
        </div>
      </div>

      {/* dark mode */}

      <div className="flex items-center justify-between gap-2 p-3 mt-4 border rounded-md">
        <div className="flex items-center gap-2 text-sm">
          <img
            src={assets.theme_icon}
            className="w-4.5 not-dark:invert"
            alt=""
          />
          <p>Dark Mode</p>
        </div>

        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={theme === "dark"} // مربوط بالـ Context
            onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
          />
          <div
            className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600
        after:content-[''] after:absolute after:top-[2px] after:left-[2px]
        after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all
        peer-checked:after:translate-x-full"
          ></div>
        </label>
      </div>


      {/* user account */}
      <div className="flex items-center gap-3 p-3 mt-4 border border-gray-300
      dark:border-white/15 rounded-md cursor-pointer group">
        <img src={assets.user_icon} className="w-7 rounded-full" alt="" />
        <p className="flex-1 text-sm dark:text-primary truncate">{user?user.name:"Login Your Account"}</p>
        {user&&<img onClick={handleLogout} src={assets.logout_icon} className="h-5 cursor-pointer hidden group-hover:block not-dark:invert"/>}

      </div>

      <img onClick={()=>setIsMenuOpen(false)} src={assets.close_icon} className="absolute top-3 right-3 w-5 h-5
      cursor-pointer md:hidden not-dark:invert" alt="" />
    </div>
  );
};

export default Sidebar;
