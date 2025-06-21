import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'

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
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB')
      return
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg']
    if (!allowedTypes.includes(file.type)) {
      alert('Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG) are allowed')
      return
    }

    setSelectedFile(file)
    
    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const clearSelectedFile = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const sendMessage = async () => {
    if (!message.trim() && !selectedFile) return

    setIsUploading(true)

    try {
      let messageData = {
        message: message.trim(),
        username: username,
        timestamp: new Date().toISOString(),
        type: 'text'
      }

      if (selectedFile) {
        const base64Data = await convertFileToBase64(selectedFile)
        messageData = {
          ...messageData,
          type: selectedFile.type.startsWith('image/') ? 'image' : 'video',
          fileData: base64Data,
          fileName: selectedFile.name,
          fileSize: selectedFile.size
        }
      }

      socket.emit('sendMessage', messageData)
      setMessage('')
      clearSelectedFile()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const setUser = () => {
    if (username.trim()) {
      socket.emit('setUsername', username)
      setIsUsernameSet(true)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const renderMessage = (msg, index) => {
    const isOwnMessage = msg.username === username

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
          {!isOwnMessage && <p className="font-bold text-sm mb-1">{msg.username}</p>}
          
          {msg.type === 'image' && msg.fileData && (
            <div className="mb-2">
              <img 
                src={msg.fileData} 
                alt={msg.fileName || 'Shared image'}
                className="max-w-full max-h-64 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(msg.fileData, '_blank')}
              />
              {msg.fileName && (
                <p className="text-xs mt-1 opacity-75">{msg.fileName}</p>
              )}
            </div>
          )}
          
          {msg.type === 'video' && msg.fileData && (
            <div className="mb-2">
              <video 
                src={msg.fileData}
                controls
                className="max-w-full max-h-64 rounded-lg"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              {msg.fileName && (
                <p className="text-xs mt-1 opacity-75">{msg.fileName}</p>
              )}
            </div>
          )}
          
          {msg.message && <p>{msg.message}</p>}
        </div>
        <p className="text-xs text-gray-500 mt-1">Just now</p>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 min-h-screen flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-indigo-700 my-6">Real Time Chatting</h1>
      
      {!isUsernameSet ? (
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join the Conversation</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="text" 
              value={username} 
              className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Enter your username" 
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && setUser()}
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
          
          <div className="messages-container h-96 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 italic my-10">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg, index) => renderMessage(msg, index))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* File Preview */}
          {selectedFile && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-start gap-3 bg-white p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  {selectedFile.type.startsWith('image/') ? (
                    <span className="w-6 h-6 text-blue-500 text-lg">🖼️</span>
                  ) : selectedFile.type.startsWith('video/') ? (
                    <span className="w-6 h-6 text-red-500 text-lg">🎥</span>
                  ) : (
                    <span className="w-6 h-6 text-gray-500 text-lg">📄</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{selectedFile.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  {previewUrl && selectedFile.type.startsWith('image/') && (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="mt-2 max-w-32 max-h-32 rounded object-cover"
                    />
                  )}
                </div>
                <button
                  onClick={clearSelectedFile}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
                >
                  <span className="text-lg">✕</span>
                </button>
              </div>
            </div>
          )}
          
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 p-3 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors duration-200"
                disabled={isUploading}
                title="Upload file"
              >
                <span className="text-lg">📎</span>
              </button>
              <input 
                type="text" 
                value={message} 
                className="flex-1 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Type your message..." 
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                disabled={isUploading}
              />
              <button 
                className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2" 
                onClick={sendMessage}
                disabled={isUploading || (!message.trim() && !selectedFile)}
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>➤</span>
                )}
                {isUploading ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
