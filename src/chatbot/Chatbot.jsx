import React, { useState, useEffect, useRef } from "react";
import chatbotQA from "./chatbotData";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);

  const chatBodyRef = useRef(null);
  const recognitionRef = useRef(null);
    const [open, setOpen] = useState(false);
  

  // ------- AUTO SCROLL -------
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  // ------- VOICE RECOGNITION -------
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setListening(true);

    recognitionRef.current.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setInput(voiceText);
      sendMessage(voiceText); // auto send
    };

    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.start();
  };

  // ------- BOT SPEAK -------
  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.pitch = 1;
    speech.rate = 1;
    speech.volume = 1;
    window.speechSynthesis.speak(speech);
  };

  // ------- SEND MESSAGE -------
  const sendMessage = (forcedText = null) => {
    const finalText = forcedText || input;
    if (!finalText.trim()) return;

    const userMsg = { sender: "user", text: finalText };

    // generate bot reply
    const q = finalText.toLowerCase().trim();
    let botReply = "Sorry, I didn’t understand that. Try again 😊";

    for (let key in chatbotQA) {
      if (q.includes(key)) {
        botReply = chatbotQA[key];
        break;
      }
    }

    const botMsg = { sender: "bot", text: botReply };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");

    // speak the bot reply
    speak(botReply);
  };

  return (
  <>
    {/* Floating Icon */}
    <div 
      className="floating-chat-icon" 
      onClick={() => setOpen(!open)}
    >
      💬
    </div>

    {/* Chatbot Box */}
    {open && (
      <div className="chatbot-box">
        <div className="chat-header">💬 Assistant</div>

        <div className="chat-body" ref={chatBodyRef}>
          {messages.map((msg, i) => (
            <p key={i} className={msg.sender === "user" ? "user-msg" : "bot-msg"}>
              {msg.text}
            </p>
          ))}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask me anything…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            className={`mic-btn ${listening ? "active" : ""}`}
            onClick={startListening}
          >
            🎤
          </button>

          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>
    )}
  </>
);

}
