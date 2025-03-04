import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

function App() {
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [isUsernameSet, setIsUsernameSet] = useState(false)

  const socket = io('https://web-socket-chat-app-w5nq.onrender.com', {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  })

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server')
    })
    const handleMessageReceive = (data) => {
      setMessages(prevMessages => [...prevMessages, data])
    }
    socket.on('receiveMessage', handleMessageReceive)
    return () => {
      socket.off('receiveMessage', handleMessageReceive)
    }
  }, [])

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('sendMessage', { username, message })
      setMessage('')
    }
  }

  const setUser = () => {
    if (username.trim()) {
      socket.emit('setUsername', username)
      setIsUsernameSet(true)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      isUsernameSet ? sendMessage() : setUser()
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 font-sans">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-3xl font-bold text-center">Real-Time Chat App</h1>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-2xl">
        {!isUsernameSet ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <input 
              type="text" 
              value={username} 
              className="w-full mb-4 px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
              placeholder="Enter your username" 
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button 
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              onClick={setUser}
            >
              Start Chatting
            </button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto mb-4 space-y-3">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-xl p-4 shadow-md max-w-md mx-auto break-words"
                >
                  <span className="font-bold text-blue-600 mr-2">{msg.username}:</span>
                  <span>{msg.message}</span>
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <input 
                type="text" 
                value={message} 
                className="flex-grow px-4 py-3 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300" 
                placeholder="Type your message..." 
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button 
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
