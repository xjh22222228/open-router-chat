"use client";
/**
 * @author https://github.com/xjh22222228
 * @date 2025-05-09
 */
import ChatItem from "@/components/ChatItem";
import type { Chat } from "@/components/ChatItem";
import React from "react";
import styles from "./style.module.css";
import AssistantNavigationIcon from "@mui/icons-material/AssistantNavigation";
import StopCircleIcon from "@mui/icons-material/StopCircle";
import "@/assets/markdown.css";
import md from "@/utils/markdown";
import Login from "@/components/Login";
import useApi from "@/hooks/useApi";
import LogoutIcon from "@mui/icons-material/Logout";

interface HistoryChat {
  role: "user" | "assistant";
  content: string;
}

let historyChats: HistoryChat[] = [];

export default function ChatApp() {
  const [chats, setChats] = React.useState<Chat[]>([]);
  const [pending, setPending] = React.useState(false);
  const [content, setContent] = React.useState("");
  const contentRef = React.useRef<HTMLDivElement>(null);
  const controller = React.useRef<AbortController | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [API_KEY] = useApi();

  function scrollToBottom() {
    const chatContainer = contentRef.current;
    if (chatContainer) {
      chatContainer.scroll({
        top: chatContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  React.useEffect(() => {
    scrollToBottom();
  }, [chats]);

  React.useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  async function submitChat() {
    if (pending) {
      controller.current?.abort();
      setPending(false);
      return;
    }

    const prompts = `
1. 使用 Markdown 格式化您的回复。使用反引号来格式化文件、目录、函数和类的名称。使用 ( 和 ) 进行行内数学运算，使用 [ 和 ] 进行块数学运算。
2. 对话时要友好但要专业。
3. 永远不要撒谎或编造事实。
4. 当结果出乎意料时，不要总是道歉。相反，尽力继续操作或向用户解释情况，但不要道歉。
5. 请使用中文来回答用户的问题。
`;
    const userContent =
      chats.length !== 0
        ? content
        : `用户的问题是："${content}"。
${prompts}
`.trim();

    const chat: Chat = {
      own: true,
      content,
    };
    historyChats.push({
      role: "user",
      content: userContent,
    });
    setChats((prev) => [...prev, chat]);
    setPending(true);
    setContent("");

    try {
      controller.current = new AbortController();
      const signal = controller.current.signal;
      const chatItem: Chat = {
        content: "",
        own: false,
        loading: true,
      };
      setChats((prev) => [...prev, chatItem]);
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stream: true,
          model: "mistralai/mistral-7b-instruct:free",
          messages: historyChats,
        }),
        signal,
      });

      let contentChats = "";
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            historyChats.push({
              role: "assistant",
              content: contentChats,
            });
            break;
          }
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n").filter((line) => line.trim() !== "");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              if (line.includes("[DONE]")) continue;
              try {
                const json = JSON.parse(line.replace("data: ", ""));
                const content = json.choices[0]?.delta?.content || "";
                contentChats += content;
                setChats((prev) => {
                  const newChats = [...prev];
                  newChats.at(-1)!.loading = false;
                  newChats.at(-1)!.content = md.render(contentChats);
                  return newChats;
                });
              } catch (e) {
                console.log(e);
              }
            }
          }
          console.log(contentChats);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setPending(false);
    }
  }

  function handleKeyUp(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      submitChat();
    }
  }

  function handleSignOut() {
    localStorage.removeItem("API_KEY");
    window.location.reload();
  }

  return (
    <div className="h-[100vh] flex flex-col w-full lg:w-[1024px] m-auto pb-2">
      {!API_KEY && <Login />}

      <LogoutIcon
        className="z-10 absolute top-5 right-5 cursor-pointer"
        onClick={handleSignOut}
      />
      <div
        className="flex-1 overflow-hidden overflow-y-auto pb-5 relative"
        ref={contentRef}
      >
        {chats.length === 0 && (
          <div className="absolute top-[50%] text-center w-full">
            你好，有什么可以帮到您的吗？
          </div>
        )}

        {chats.map((chat, idx) => (
          <ChatItem key={idx} {...chat} />
        ))}
      </div>

      <footer className="relative px-2">
        <textarea
          ref={textareaRef}
          value={content}
          className={styles.textarea}
          placeholder="Message ChatGPT..."
          onKeyUp={handleKeyUp}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className={styles.iconBox} onClick={submitChat}>
          {pending ? (
            <StopCircleIcon className="!w-10 !h-10" />
          ) : (
            <AssistantNavigationIcon
              className="!w-10 !h-10"
              color={content ? "inherit" : "action"}
            />
          )}
        </div>
      </footer>
    </div>
  );
}
