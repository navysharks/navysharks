import React, { useState, useEffect, useRef } from "react";
import { X, Send, User, Shield, Loader2 } from "lucide-react";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  senderId: string;
  isConcierge: boolean;
  createdAt: any;
}

export function ConciergeChatModal({
  isOpen,
  onClose,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // W7: Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (botTimeoutRef.current) clearTimeout(botTimeoutRef.current);
    };
  }, []);

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isOpen || !userId) return;

    setIsLoading(true);
    const messagesRef = collection(db, "chats", userId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [isOpen, userId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId) return;

    const textToSend = newMessage.trim();
    setNewMessage("");

    const messagesRef = collection(db, "chats", userId, "messages");
    
    try {
      // Add User Message
      await addDoc(messagesRef, {
        text: textToSend,
        senderId: userId,
        isConcierge: false,
        createdAt: serverTimestamp(),
      });

      // W7: Store timeout in ref so it can be cleared
      botTimeoutRef.current = setTimeout(async () => {
        try {
          await addDoc(messagesRef, {
            text: "Thank you for reaching out. A dedicated lifestyle manager is reviewing your request and will assist you shortly.",
            senderId: "concierge-bot",
            isConcierge: true,
            createdAt: serverTimestamp(),
          });
        } catch (e) {
          console.error("Failed to send automated reply", e);
        }
      }, 1500);
    } catch (error) {
      // W8: Handle failure
      console.error("Failed to send message", error);
      toast.error("Failed to send message. Please try again.");
      setNewMessage(textToSend); // Restore user's draft
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:justify-end sm:p-6 bg-black/50 backdrop-blur-sm transition-opacity">
      <div className="bg-slate-900 border border-slate-700 shadow-2xl rounded-2xl w-full max-w-md h-[600px] max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-right-8 duration-300">
        
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-900/30 flex items-center justify-center border border-cyan-500/30 relative">
              <Shield className="w-5 h-5 text-cyan-400" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950"></div>
            </div>
            <div>
              <h3 className="text-white font-bold text-lg leading-tight">Live Concierge</h3>
              <p className="text-cyan-400 text-xs tracking-wider uppercase font-semibold">Online</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900/50">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center">
                <Shield className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">
                Welcome to your private concierge channel. How can we elevate your experience today?
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] ${
                  msg.isConcierge ? "mr-auto" : "ml-auto flex-row-reverse"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.isConcierge ? "bg-slate-800" : "bg-cyan-600"
                  }`}
                >
                  {msg.isConcierge ? (
                    <Shield className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`rounded-2xl px-4 py-2 ${
                    msg.isConcierge
                      ? "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                      : "bg-cyan-500 text-slate-950 rounded-tr-none font-medium shadow-[0_4px_15px_rgba(6,182,212,0.2)]"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex-shrink-0">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your request..."
              className="w-full bg-slate-900 border border-slate-700 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="absolute right-2 p-2 bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 text-slate-950 disabled:text-slate-500 rounded-full transition-colors flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
