import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import './App.css'
const socket = io('https://web-socket-chat-app-w5nq.onrender.com', {
  transports: ['websocket'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})
function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [isUsernameSet, setIsUsernameSet] = useState(false)
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server')
    })
    
    const handleMessageReceive = (data) => {
      setMessages((prevMessages) => [...prevMessages, data])
    }
    
    socket.on('receiveMessage', handleMessageReceive)
    
    return () => {
      socket.off('receiveMessage', handleMessageReceive)
    }
  }, [])
  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', message)
      setMessage('')
    }
  }
  const setUser = () => {
    if (username.trim()) {
      socket.emit('setUsername', username)
      setIsUsernameSet(true)
    }
  }
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-indigo-700 my-6">Real Time Chat App</h1>
      
      {!isUsernameSet ? (
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join the Conversation</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={username} 
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Enter your username" 
              onChange={(e) => { setUsername(e.target.value) }} 
            />
            <button 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200" 
              onClick={setUser}
            >
              Start Chatting
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-indigo-600 text-white p-4">
            <h2 className="text-xl font-semibold">Chat Room</h2>
            <p className="text-indigo-200">Welcome, {username}!</p>
          </div>
          
          <div className="messages-container h-96 overflow-y-auto p-4 flex flex-col gap-2">
            {messages && messages.length === 0 ? (
              <p className="text-center text-gray-500 italic my-10">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg, index) => {
                const isOwnMessage = msg.username === username;
                return (
                  <div 
                    key={index} 
                    className={`max-w-[80%] ${isOwnMessage ? 'self-end' : 'self-start'}`}
                  >
                    <div className={`rounded-lg p-3 break-words ${
                      isOwnMessage 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}>
                      {!isOwnMessage && <p className="font-bold text-sm">{msg.username}</p>}
                      <p>{msg.message}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Just now</p>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={message} 
                className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Type your message..." 
                onChange={(e) => { setMessage(e.target.value) }}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200" 
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default App
