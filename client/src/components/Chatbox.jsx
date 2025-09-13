import React, { useEffect, useRef, useState } from "react";

import { assets } from "../assets/assets";
import { useAppContext } from "../context/Appcontext";
import Message from "./Message";
import toast from "react-hot-toast";
import axios from "axios";

const Chatbox = () => {
  const containerRef = useRef(null);

  const { selectChat, theme, user, setUser, token } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState("text");
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!user) return toast.error("Please login to send message");
      setLoading(true);
      const promptCopy = prompt;
      setPrompt("");
      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: prompt,
          timestamp: new Date(),
          isImage: false,
        },
      ]);
      const res = await axios.post(
        `/api/message/${mode}`,
        {
          chatId: selectChat._id,
          prompt,
          isPublished,
        },
        { headers: { Authorization: token } }
      );

      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.replay]);
        // decrease credits
        if (mode === "image") {
          setUser((prev) => ({ ...prev, credits: prev.credits - 2 }));
        } else {
          setUser((prev) => ({ ...prev, credits: prev.credits - 1 }));
        }
      } else {
        toast.error(res.data.message);
        setPrompt(promptCopy);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setPrompt("");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectChat) {
      setMessages(selectChat.messages);
    }
  }, [selectChat]);

  // for auto scroll to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);
  return (
    <div
      className="flex-1 flex flex-col justify-between m-5 md:m-10
    xl:mx-30 max-md:mt-14 2xl:pr-40"
    >
      {/* chat messages */}
      <div ref={containerRef} className="flex-col mb-5 overflow-y-scroll">
        {messages.length === 0 && (
          <div
            className="h-full flex flex-col justify-between m-5 md:m-10 xl:mx-30
          max-md:mt-14 2xl:pr-40"
          >
            <img
              src={theme === "dark" ? assets.logo_full : assets.logo_full_dark}
            />

            <p className="mt-5  sm:text-6xl text-center text-gray-400 dark:text-white">
              Ask me anything
            </p>
          </div>
        )}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}

        {/* tree dots loading inimation */}
        {loading && (
          <div className="loader flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full dark:bg-white animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full dark:bg-white animate-bounce"></div>
          </div>
        )}
      </div>

      {mode === "image" && (
        <label className="inline-flex items-center gap-2 mb-3 text-sm mx-auto">
          <p className="text-xs">Public Generated Image To Community</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4"
          />
        </label>
      )}
      {/* prompt input box */}
      <form
        onSubmit={handleSubmit}
        className="bg-primary/20 dark:bg-[#583C79] border border-primary dark:border-[#80609F]/30 rounded-full w-full max-w-2xl p-3 pl-4 mx-auto flex items-center gap-4"
      >
        <select
          onChange={(e) => setMode(e.target.value)}
          value={mode}
          className="text-sm pl-3 pr-2 outline-none"
        >
          <option className="dark:bg-purple-900" value="text">
            Text
          </option>
          <option className="dark:bg-purple-900" value="image">
            Image
          </option>
        </select>
        <input
          type="text"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          placeholder="Type Your Prompt here ..."
          className="flex-1 w-full text-sm outline-none"
          required
        />
        <button disabled={loading}>
          <img
            src={loading ? assets.stop_icon : assets.send_icon}
            alt=""
            className="cursor-pointer w-8"
          />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
