import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/dist/server/api-utils";
import dotenv from "dotenv";
import express from "express";
import Replicate from "replicate";

dotenv.config();

const replicate = new Replicate({
    auth: `${process.env.AI_KEY}`,
  });
  
  const embeddingCache = new Map();
  
  function preprocessText(text) {
    return text.replace(/\s+/g, " ").trim().toLowerCase();
  }
  
export async function POST(request:Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ message: "invalid request" }, { status: 409 });
  }
  const { inputMessage } = await request.json();

  try {

    const input = {
        prompt: inputMessage,
        max_tokens: 150,
      };
    
      let ResponseText = "";

      try {
        for await (const event of replicate.stream(
          "meta/meta-llama-3-8b-instruct",
          { input }
        )) {
            ResponseText += event.toString();
        }
      } catch (error) {
        console.error("Error generating ai response:", error);
        return "Error generating ai response";
      }


    return NextResponse.json(
        {message: ResponseText},
         {status: 201})

  } catch (error) {
    return NextResponse.json(
      { message: "Something went wronggg" },
      { status: 500 },
    );
  }

}