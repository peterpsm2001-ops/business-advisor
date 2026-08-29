"use client";
import { useState, useEffect, useRef } from "react";

const UserAvatar = () => (
  <div style={styles.avatarUser}>
    <span>Y</span>
  </div>
);

const AdvisorAvatar = () => (
  <div style={styles.avatarAdvisor}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  </div>
);

const MicIcon = ({ isListening }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isListening ? "#ef4444" : "#9b9b9b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const SpeakerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9b9b9b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const MuteIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
);

const SoundOnIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ececf1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#212121" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/>
    <polyline points="5 12 12 5 19 12"/>
  </svg>
);

const LANGUAGES = [
  { code: "ta-IN", name: "தமிழ் (Tamil)" },
  { code: "en-IN", name: "English (India)" },
  { code: "hi-IN", name: "हिंदी (Hindi)" },
];

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLang, setSelectedLang] = useState("ta-IN");
  const [voices, setVoices] = useState([]);
  const [isMuted, setIsMuted] = useState(false);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const avail = window.speechSynthesis.getVoices();
        if (avail.length > 0) {
          setVoices(avail);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = selectedLang;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [selectedLang]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = selectedLang;
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const toggleMute = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (!isMuted) {
        window.speechSynthesis.cancel();
      }
    }
    setIsMuted(!isMuted);
  };

  const speakText = (text) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();

    let cleanText = text
      .replace(/[*#_`]/g, "")
      .replace(/\$/g, " ரூபாய் ")
      .replace(/USD/gi, " ரூபாய் ");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = selectedLang;

    const allVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    const tamilVoice = allVoices.find(
      (v) => v.lang === "ta-IN" || v.lang.startsWith("ta") || v.name.toLowerCase().includes("tamil")
    );

    if (tamilVoice) {
      utterance.voice = tamilVoice;
    }

    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const rupeePrompt = `[System Instruction: Always state all monetary values in Indian Rupees (₹ or ரூபாய்). Never use Dollars ($).] ${input}`;
    
    const userMsg = input;
    setInput("");
    window.speechSynthesis.cancel();

    setMessages((prev) => [...prev, { sender: "You", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: rupeePrompt }),
      });
      const data = await res.json();
      
      let reply = data.response || "No response received.";
      reply = reply.replace(/\$/g, "₹");

      setMessages((prev) => [...prev, { sender: "Business Advisor", text: reply }]);
      speakText(reply);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "Business Advisor", text: "Error connecting to backend server on port 8000." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <span style={styles.brandTitle}>Business Advisor</span>
        <div style={styles.headerControls}>
          <button 
            onClick={toggleMute} 
            style={{ ...styles.muteButton, borderColor: isMuted ? "#ef4444" : "#424242" }} 
            title={isMuted ? "Unmute Voice" : "Mute Voice"}
          >
            {isMuted ? <MuteIcon /> : <SoundOnIcon />}
            <span style={{ color: isMuted ? "#ef4444" : "#ececf1", fontSize: "12px" }}>
              {isMuted ? "Muted" : "Sound On"}
            </span>
          </button>
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            style={styles.langSelect}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main style={styles.chatStream}>
        {messages.length === 0 && (
          <div style={styles.emptyState}>
            <h2>Business Advisor</h2>
            <p>வணக்கம்! உங்கள் வியாபாரத்திற்கு நான் எவ்வாறு உதவ வேண்டும்?</p>
          </div>
        )}

        {messages.map((m, idx) => (
          <div key={idx} style={styles.messageRow}>
            {m.sender === "You" ? <UserAvatar /> : <AdvisorAvatar />}
            <div style={styles.messageContent}>
              <div style={styles.senderName}>{m.sender}</div>
              <div style={styles.messageBody}>{m.text}</div>
              {m.sender === "Business Advisor" && (
                <div style={styles.actionRow}>
                  <button onClick={() => speakText(m.text)} style={styles.iconButton} title="Listen (Tamil)">
                    <SpeakerIcon />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={styles.messageRow}>
            <AdvisorAvatar />
            <div style={styles.messageContent}>
              <div style={styles.senderName}>Business Advisor</div>
              <div style={styles.loadingText}>சிந்திக்கிறது...</div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer style={styles.footer}>
        <div style={styles.inputPill}>
          <button onClick={toggleListening} style={styles.micButton} title="Speak">
            <MicIcon isListening={isListening} />
          </button>
          <input
            style={styles.textInput}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message Business Advisor..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} style={{ ...styles.sendButton, opacity: input.trim() ? 1 : 0.4 }} disabled={!input.trim() || loading}>
            <SendIcon />
          </button>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    backgroundColor: "#212121",
    color: "#ececf1",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 24px",
    backgroundColor: "#212121",
  },
  brandTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#ececf1",
  },
  headerControls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  muteButton: {
    backgroundColor: "#2f2f2f",
    border: "1px solid #424242",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    outline: "none",
  },
  langSelect: {
    backgroundColor: "#2f2f2f",
    color: "#ececf1",
    border: "1px solid #424242",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "13px",
    outline: "none",
    cursor: "pointer",
  },
  chatStream: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 0",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  emptyState: {
    margin: "auto",
    textAlign: "center",
    color: "#b4b4b4",
  },
  messageRow: {
    display: "flex",
    gap: "16px",
    width: "100%",
    maxWidth: "768px",
    margin: "0 auto",
    padding: "0 24px",
  },
  avatarUser: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#10a37f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
    fontSize: "14px",
    color: "#fff",
    flexShrink: 0,
  },
  avatarAdvisor: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#2f2f2f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  messageContent: {
    flex: 1,
  },
  senderName: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#ececf1",
    marginBottom: "4px",
  },
  messageBody: {
    fontSize: "15px",
    lineHeight: "1.6",
    color: "#d1d5db",
    whiteSpace: "pre-wrap",
  },
  actionRow: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
  iconButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    borderRadius: "4px",
    display: "flex",
    alignItems: "center",
  },
  loadingText: {
    color: "#8e8e93",
    fontSize: "15px",
    fontStyle: "italic",
  },
  footer: {
    padding: "16px 24px 24px",
    backgroundColor: "#212121",
    display: "flex",
    justifyContent: "center",
  },
  inputPill: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    maxWidth: "768px",
    backgroundColor: "#2f2f2f",
    borderRadius: "24px",
    padding: "8px 14px",
    gap: "10px",
    border: "1px solid #383838",
  },
  micButton: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "4px",
    display: "flex",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ececf1",
    fontSize: "15px",
  },
  sendButton: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    backgroundColor: "#ffffff",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
};
