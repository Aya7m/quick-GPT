import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyChats, dummyUserData } from "../assets/assets";

import axios from "axios";
import toast from "react-hot-toast";
axios.defaults.baseURL=import.meta.env.VITE_SERVER_URL;

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [selectChat, setSelectChat] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const[token,setToken]=useState(localStorage.getItem("token")||null);
  const[loadUser,setLoadUser]=useState(true);


  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/me", { headers: { Authorization: token } });
      if(data.success){
        setUser(data.user);
      }else{
        toast.error(data.message);
        setUser(null);
      }
      
    } catch (error) {
      toast.error(error.response.data.message);
      
    }finally{
      setLoadUser(false);
    }
  };


  // create new chat

  const createNewChat = async () => {
    try {
      if(!user) return toast.error("Please login to create new chat");
      navigate("/");
      await axios.post(
  "/api/chat/create",
  {}, // الـ body (فاضي)
  { headers: { Authorization: token } } // الهيدر هنا
);

      await fetchUserChats();
      
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const fetchUserChats = async () => {
   try {
    const { data } = await axios.get("/api/chat/all", { headers: { Authorization: token } });
    if(data.success){
      setChats(data.chats);
      // if user has not chats create new chat
      if(data.chats.length===0) {
        await createNewChat();
        return fetchUserChats();
      }else{
        setSelectChat(data.chats[0]);
      }
      
    }else{
      toast.error(data.message);
    }
   } catch (error) {
    toast.error(error.message);
    
   }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      fetchUserChats();
    } else {
      setChats([]); // ← دي اللي تتغير
      setSelectChat(null);
    }
  }, [user]);

  useEffect(() => {
    if(token) {
    fetchUser();
    }else{
      setUser(null);
      setLoadUser(false);
    }
  }, [token]);
  const value = {
    user,
    navigate,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectChat,
    setSelectChat,
    theme,
    setTheme,
    createNewChat,
    token,
    setToken,
    loadUser,
    fetchUserChats,
    axios
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
