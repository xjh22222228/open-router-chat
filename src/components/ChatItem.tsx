"use client";
import React from "react";
import Avatar from "@mui/material/Avatar";
import styles from "./styles.module.css";
import md from "@/utils/markdown";

export interface Chat {
  content: string;
  own: boolean;
}

function ChatItem({ own, content }: Chat) {
  const [typingIndex, setTypingIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setTimeout(() => {
      if (typingIndex < content.length) {
        setTypingIndex((prev) => prev + 1);
      }
    }, 5);
    return () => {
      clearTimeout(id);
    };
  }, [typingIndex, content]);

  const message = React.useMemo(() => {
    return md.render(content.slice(0, typingIndex));
  }, [typingIndex, content]);

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
          {content.length === 0 && !own && (
            <div className={styles.loading}></div>
          )}

          <div
            className="markdown-body"
            dangerouslySetInnerHTML={{ __html: message }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ChatItem);
