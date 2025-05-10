"use client";
import React from "react";
import Avatar from "@mui/material/Avatar";
import styles from "./styles.module.css";

export interface Chat {
  content: string;
  own: boolean;
  loading?: boolean;
}

function ChatItem({ own, content, loading }: Chat) {
  return (
    <div className="flex w-full mt-10">
      <div className="w-10 h-10 bg-red-500 rounded-full p-2">
        <Avatar
          src={own ? "own.svg" : "/chatgpt.svg"}
          sizes="100%"
          alt="chatgpt"
          className="!w-full !h-full"
        />
      </div>
      <div className="ml-2 flex-1 w-[0px]">
        <div className="text-xl font-bold mt-1.5">
          {own ? "You" : "ChatGPT"}
        </div>
        <div>
          {loading && <div className={styles.loading}></div>}

          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: content }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChatItem);
