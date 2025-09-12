import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import moment from "moment";
import Markdown from "react-markdown";
import Prism from "prismjs";


const Message = ({ message }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [message]);

  return (
    <div>
      {message.role === "user" ? (
        <div className="flex justify-end items-start my-4 gap-2">
          <div
            className={`
              flex flex-col gap-2 p-2 px-4 bg-slate-50
              dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15
              rounded-md
            `}
          >
            <p className="text-sm text-gray-600 dark:text-white">
             
              {message.content}
            </p>
            <span className="text-xs text-gray-600 dark:text-white">
              {moment(message.timestamp).fromNow()}
            </span>
          </div>
          <img src={assets.user_icon} className="w-8 h-8 rounded-full" alt="" />
        </div>
      ) : (
        <div
          className={`
            inline-flex items-start gap-10 my-4 p-2 px-4 bg-slate-50 max-w-2xl
            dark:bg-[#57317C]/10 border border-gray-300 dark:border-[#80609F]/15
            rounded-md
          `}
        >
          {message.isImage ? (
            <img
              src={message.content}
              className="w-full max-w-md mt-2"
              alt="Generated"
            />
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-white">
                <Markdown>{message.content}</Markdown>
              </p>
              <spa>
                {moment(message.timestamp).fromNow()}
              </spa>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Message;
