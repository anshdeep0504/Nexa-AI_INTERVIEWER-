"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions.map((q) => `- ${q}`).join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center pb-8 border-b border-gray-200">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">AI Interview Session</h1>
        <p className="text-lg text-gray-600">Practice with Nexa, your intelligent AI interviewer.</p>
      </div>

      {/* Interview Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        {/* AI Interviewer Card (Left) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-md p-8 text-center flex flex-col items-center">
          <div className="relative flex items-center justify-center w-32 h-32 mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl" />
              <div className={cn("relative w-full h-full rounded-full flex items-center justify-center shadow-lg", isSpeaking ? "bg-blue-500" : "bg-gray-800")}>
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              {isSpeaking && <div className="absolute inset-0 rounded-full bg-blue-400/50 animate-ping" />}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Nexa AI</h3>
          <p className="text-gray-500 mb-4">Ready to conduct your interview</p>
          <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <div className={cn("w-3 h-3 rounded-full transition-colors", callStatus === "ACTIVE" ? "bg-green-500" : callStatus === "CONNECTING" ? "bg-yellow-500" : "bg-gray-400")} />
              <span className="text-sm font-semibold text-gray-700">
                  {callStatus === "ACTIVE" ? "Connected" : callStatus === "CONNECTING" ? "Connecting..." : "Ready"}
              </span>
          </div>
        </div>

        {/* User & Transcript (Right) */}
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-8 flex items-center gap-6">
              <div className="relative w-24 h-24">
                <Image src="/user-avatar.png" alt="profile-image" width={96} height={96} className="rounded-full object-cover border-4 border-white shadow-md"/>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{userName}</h3>
                <p className="text-gray-500">Interview Candidate</p>
              </div>
          </div>

          {/* Transcript */}
          {messages.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Conversation Transcript
              </h3>
              <div className="space-y-4 max-h-80 overflow-y-auto p-4 bg-gray-50 rounded-lg">
                {messages.map((message, index) => (
                  <div key={index} className={cn("flex items-start gap-3", message.role === "user" ? "justify-end" : "")}>
                    {message.role !== "user" && <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-800 flex items-center justify-center text-white text-sm font-bold">AI</div>}
                    <div className={cn("p-4 rounded-xl max-w-md", message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200")}>
                      <p className="text-sm leading-relaxed text-black">{message.content}</p>
                    </div>
                    {message.role === "user" && <div className="w-8 h-8 rounded-full flex-shrink-0 bg-blue-500 flex items-center justify-center text-white text-sm font-bold">You</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <div className="flex justify-center pt-8">
          {callStatus !== "ACTIVE" ? (
              <button className={cn("px-12 py-4 text-lg font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1", callStatus === "CONNECTING" ? "bg-yellow-500 text-white cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white")} onClick={handleCall} disabled={callStatus === "CONNECTING"}>
                  <span className="relative flex items-center gap-3">
                      {callStatus === "CONNECTING" && <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />}
                      {callStatus === "CONNECTING" ? "Connecting..." : "Start Interview"}
                  </span>
              </button>
          ) : (
              <button className="px-12 py-4 text-lg font-semibold bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all" onClick={handleDisconnect}>
                  End Interview
              </button>
          )}
      </div>
    </div>
  );
};

export default Agent;
