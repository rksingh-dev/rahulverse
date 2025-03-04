import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("https://web-socket-chat-app-w5nq.onrender.com", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    const handleMessageReceive = (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    socket.on("receiveMessage", handleMessageReceive);

    return () => {
      socket.off("receiveMessage", handleMessageReceive);
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  const setUser = () => {
    if (username.trim()) {
      socket.emit("setUsername", username);
      setIsUsernameSet(true);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center h-screen w-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">
          Real-Time Chat App
        </h1>

        {!isUsernameSet ? (
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={username}
              className="w-full border border-gray-300 p-3 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition"
              onClick={setUser}
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <>
            {/* Chat Messages */}
            <div
              className="overflow-y-auto h-64 p-4 border border-gray-200 rounded-lg bg-gray-50"
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 my-2 rounded-lg w-fit max-w-xs ${
                    msg.username === username
                      ? "bg-blue-500 text-white ml-auto"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <strong>{msg.username}: </strong>
                  {msg.message}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex mt-4">
              <input
                type="text"
                value={message}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
