"use client";

import {
  ArrowUp,
  GraduationCap,
  PackageSearch,
  PenLine,
  ShoppingBag
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


type Conversation = {
  inputMessage: string;
  aiResponse: string;
};

export default function Home() {
  const [inputMessage, setInputMessage] = useState("");
  const [aiResponse, setAiResponse] = useState(null);
  const [responses, setResponses] = useState([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [iconColor, setIconColor] = useState(false)
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (inputMessage.length > 0) {
      setIconColor(true);
      const timeoutId = setTimeout(() => setIconColor(false), 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setIconColor(false);
    }
  }, [inputMessage]);

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    try {
      setLoading(true)
      const response = await fetch(`/api/interaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to send connection request");
      }

      const data = await response.json();
      setLoading(false);
      const newConversation = { inputMessage, aiResponse: data.message };
      setConversations((prevConversations) => [...prevConversations, newConversation]);
      setAiResponse(data.message);
      setInputMessage("");

      console.log("The response is", data);
    } catch (error: any) {
      console.error("Error:", error.message);
    }
  };

  const cards = [
    {
      icon: "/image/gradcap.png",
      text: "Explain superconductors",
    },
    {
      icon: "/image/editpen.png",
      text: "Create a workout plan",
    },
    {
      icon: "/image/cartbag.png",
      text: "Fun fact about the Roman Empire",
    },
    {
      icon: "/image/shoppingbag.png",
      text: "Pick outfit to look good on camera",
    },
  ];

  const loadingVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.3 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };


  return (
    <main className={`flex min-h-full ${!aiResponse ? "justify-center p-24 " : " p-5 "} flex-col items-center  `}>
      {!aiResponse && <div className="mt-[5%] ">
        <div className="p-5 mb-10 flex justify-center items-center">
          <div>
            <Image src={"/image/chatg.svg"} width={41} height={41} alt="logo" />
          </div>
        </div>
        <div className="grid gap-3 grid-cols-4">
          {cards.map((item, index) => (
            <div
              className="p-3 border w-[170px] h-[100px] hover:text-black cursor-pointer rounded-2xl hover:bg-black hover:bg-opacity-[0.03] duration-200 hover:shadow-sm"
              key={index}
            >
              <div>
                <Image alt="icon" width={20} height={20} src={item.icon} />
              </div>
              <div className="mt-[2px] text-base text-opacity-70">
                {item.text}
              </div>
            </div>
          ))}
        </div>
      </div>}

      <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex-grow w-full mb-20 max-w-4xl mx-auto ">
        <div className="space-y-8">
          {conversations.map((conversation, index) => (
            <motion.div variants={itemVariants} key={index} className="space-y-4">
              <div className=" flex justify-end">
                <motion.div variants={childVariants} className="max-w-[400px] py-3 px-4 bg-neutral-100 text-gray-800 rounded-2xl ">
                  {conversation.inputMessage}
                  </motion.div>
              </div>

              <div className="flex " >
                <motion.div  variants={childVariants} className="p-4 w-[80%] flex text-gray-800 ">
                  <div className="relative  p-[6px] mr-2 border rounded-full flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8">
                    <Image src={"/image/chato.svg"} className="min-w-[20px] min-h-[20px]" width={20} height={20} alt="logo" />
                  </div>
                  <div>{conversation.aiResponse}</div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>


      <div className="fixed bg-white p-2 bottom-0 flex items-center justify-center flex-col w-full">
        <form
          onSubmit={handleSubmit}
          className="border mb-2 flex bg-neutral-100 w-[40%] items-center px-3 rounded-full"
        >
          <div className="w-[5%] rounded-full duration-200 cursor-pointer">
            <Image height={23} width={23} alt="paper clip" src="/image/clip.png" />
          </div>
          <input
            value={inputMessage}
            onChange={(e) => { setInputMessage(e.target.value); setIconColor(true) }}
            className="w-full bg-neutral-100 outline-none py-3"
            type="text"
            placeholder="Message ChatGPT"
          />
          <button
            type="submit"
            disabled={loading}
            className={`ml-2 transition-all ${iconColor ? " bg-black " : " bg-neutral-300 "}  ${loading && "bg-neutral-300"} p-1 rounded-full flex justify-center items-center text-white min-w-[35px] min-h-[35px]`}
          >
            {!loading ? (<ArrowUp />) : (
              <motion.div
                className="bg-black w-[10px] h-[10px]"
                variants={loadingVariants}
                initial="hidden"
                animate="visible"
              />
              )}

          </button>
        </form>
        <div>
          <p className="text-xs">
            ChatGPT can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </main>
  );
}
