
# RahulVerse - Real-Time Chat Application



## 📝 Overview

RahulVerse is a modern, real-time chat application built with React and Socket.IO. It allows users to join chat rooms with a username and exchange messages in real-time with other connected users.

## ✨ Features

- **Real-time messaging**: Instant message delivery using WebSockets
- **User-friendly interface**: Clean, responsive design with modern UI elements
- **Username customization**: Set your display name before joining the chat
- **Message styling**: Different styles for your messages vs. others' messages
- **Responsive design**: Works seamlessly on desktop and mobile devices

## 🛠️ Technologies Used

- **Frontend**:
  - React 19
  - Socket.IO Client
  - Tailwind CSS
  - Vite

- **Backend**:
  - Node.js
  - Express
  - Socket.IO
  - MongoDB (for message persistence)

## 🚀 Live Demo

Check out the live application: [RahulVerse Chat App](https://rahulverse-chat.vercel.app)

## 📸 Screenshots

![Login Screen](https://via.placeholder.com/800x400?text=Login+Screen)
![Chat Interface](https://via.placeholder.com/800x400?text=Chat+Interface)

## 🏁 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rksingh-dev/web-socket-chat-app.git
   cd web-socket-chat-app
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm start
   
   # In a new terminal, start frontend server
   cd frontend
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## 🌐 Deployment

The application is deployed using:
- Frontend: Vercel
- Backend: Render

## 🔧 Configuration

### Frontend Configuration

The frontend connects to the backend using Socket.IO. You can configure the connection URL in `App.jsx`:

```javascript
const socket = io('https://your-backend-url.com');
```

### Backend Configuration

The backend server can be configured through environment variables:

- `PORT`: The port on which the server will run (default: 3000)
- `MONGODB_URI`: MongoDB connection string for database storage

## 📚 API Documentation

### Socket.IO Events

- `connection`: Fired when a client connects to the server
- `disconnect`: Fired when a client disconnects
- `sendMessage`: Client emits this event to send a message
- `receiveMessage`: Server emits this event to broadcast messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rahul Singh**
- GitHub: [rksingh-dev](https://github.com/rksingh-dev)
- LinkedIn: [Rahul Singh](https://linkedin.com/in/rahulsingh)

## 🙏 Acknowledgements

- [Socket.IO](https://socket.io/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Express](https://expressjs.com/)

---

Made with ❤️ by Rahul Singh
