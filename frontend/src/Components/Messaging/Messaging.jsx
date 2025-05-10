import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegPaperPlane, FaSpinner, FaRegSmile, FaPaperclip, FaEllipsisV, FaUser } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Messaging = ({ loggedUser, selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Fetch all users
  useEffect(() => {
    setIsLoadingUsers(true);
    axios
      .get("http://localhost:8080/api/users")
      .then((res) => {
        setAllUsers(res.data);
        setIsLoadingUsers(false);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        setIsLoadingUsers(false);
      });
  }, []);

  

  // Fetch messages when selectedUser changes
  useEffect(() => {
    if (loggedUser?.id && selectedUser?.id) {
      setIsLoading(true);
      axios
        .get(`http://localhost:8080/api/messages/${loggedUser.id}/${selectedUser.id}`)
        .then((res) => {
          setMessages(res.data);
          setIsLoading(false);
          
          // Scroll to bottom after messages load
          setTimeout(() => {
            const messagesContainer = document.getElementById("messages-container");
            if (messagesContainer) {
              messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
          }, 100);
        })
        .catch((err) => {
          console.error("Error fetching messages:", err);
          setIsLoading(false);
        });
    }
  }, [selectedUser, loggedUser]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = {
        senderId: loggedUser.id,
        receiverId: selectedUser.id,
        content: newMessage,
        timestamp: new Date().toISOString(),
    };

    setIsLoading(true);
    axios
      .post("http://localhost:8080/api/messages", messageData)
      .then((res) => {
        setMessages((prevMessages) => [...prevMessages, res.data]);
        setNewMessage("");
        setIsLoading(false);
        
        // Scroll to bottom after message is sent
        setTimeout(() => {
          const messagesContainer = document.getElementById("messages-container");
          if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
          }
        }, 100);
      })
      .catch((err) => {
        console.error("Error sending message:", err);
        setIsLoading(false);
      });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Message animations
  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

<Messaging loggedUser={loggedUser} selectedUser={selectedUser} />

  // If no user is selected or logged in
  if (!loggedUser) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="d-flex align-items-center justify-content-center h-100"
        style={{
          minHeight: "500px",
          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >
        <div className="text-center p-5">
          <motion.div
            animate={{ 
              scale: [0.9, 1.1, 0.9],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              repeat: Infinity,
              duration: 3
            }}
            style={{
              fontSize: "3rem",
              marginBottom: "1rem",
              color: "#2a5298"
            }}
          >
            <FaUser />
          </motion.div>
          <h4 className="font-weight-bold" style={{ color: "#1e3c72" }}>Please log in to start messaging</h4>
        </div>
      </motion.div>
    );
  }

  if (!selectedUser) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="d-flex flex-column h-100"
        style={{
          minHeight: "500px",
          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          padding: "1.5rem"
        }}
      >
        <h4 className="mb-4 font-weight-bold" style={{ color: "#1e3c72" }}>Select a user to start chatting</h4>
        
        {isLoadingUsers ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading users...</span>
            </div>
          </div>
        ) : (
          <div className="user-list" style={{ overflowY: "auto" }}>
            {allUsers.length > 0 ? (
              allUsers.filter(user => user.id !== loggedUser.id).map((user) => (
                <motion.div
                  key={user.id}
                  className="user-item d-flex align-items-center p-3 mb-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    cursor: "pointer",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    transition: "all 0.3s ease"
                  }}
                  onClick={() => {
                    // This would be implemented by the parent component
                    console.log("Selected user:", user);
                  }}
                >
                  <div 
                    className="flex-shrink-0 rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
                    style={{ width: "45px", height: "45px" }}
                  >
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="ms-3">
                    <h6 className="mb-0 font-weight-bold">{user.username || "Unknown User"}</h6>
                    <small className="text-muted">Click to start chat</small>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-muted p-4">
                <p>No users available. Invite someone to join!</p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="card border-0 h-100"
      style={{
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 15px 50px rgba(0,0,0,0.15)",
        background: "white"
      }}
    >
      {/* Chat Header */}
      <div 
        className="card-header d-flex align-items-center justify-content-between p-3"
        style={{
          background: "linear-gradient(45deg, #1e3c72, #2a5298)",
          borderBottom: "none"
        }}
      >
        <div className="d-flex align-items-center">
          <motion.div 
            className="position-relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="rounded-circle d-flex align-items-center justify-content-center text-white"
              style={{ 
                width: "45px", 
                height: "45px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                fontSize: "1.2rem"
              }}
            >
              {selectedUser.username ? selectedUser.username.charAt(0).toUpperCase() : "U"}
            </div>
            <span 
              className="position-absolute bg-success rounded-circle"
              style={{ width: "12px", height: "12px", bottom: "0", right: "0", border: "2px solid white" }}
            ></span>
          </motion.div>
          
          <div className="ms-3">
            <h5 className="mb-0 fw-bold text-white">{selectedUser.username || "User"}</h5>
            <small className="text-white-50">Online now</small>
          </div>
        </div>
        
        <motion.button
          className="btn text-white"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", borderRadius: "50%" }}
        >
          <FaEllipsisV />
        </motion.button>
      </div>
      
      {/* Messages Container */}
      <div 
        id="messages-container"
        className="card-body p-4"
        style={{ 
          height: "400px", 
          overflowY: "auto",
          background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%232a5298' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E\")"
        }}
      >
        {isLoading && messages.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <motion.div 
              animate={{ 
                rotate: 360,
                transition: { duration: 1, repeat: Infinity, ease: "linear" }
              }}
            >
              <FaSpinner className="text-primary" style={{ fontSize: "2rem" }} />
            </motion.div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center text-muted p-5">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  style={{ fontSize: "1.1rem" }}
                >
                  No messages yet. Say hello to {selectedUser.username}!
                </motion.p>
              </div>
            ) : (
              <AnimatePresence>
                {messages.map((msg, index) => {
                  const isSender = msg.senderId === loggedUser.id;
                  return (
                    <motion.div
                      key={msg.id || index}
                      variants={messageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`d-flex mb-3 ${isSender ? 'justify-content-end' : 'justify-content-start'}`}
                    >
                      {!isSender && (
                        <div 
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white me-2 align-self-end"
                          style={{ width: "30px", height: "30px", minWidth: "30px", fontSize: "0.8rem" }}
                        >
                          {selectedUser.username ? selectedUser.username.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      
                      <div 
                        className={`py-2 px-3 ${
                          isSender 
                            ? 'bg-primary text-white' 
                            : 'bg-white'
                        }`}
                        style={{ 
                          maxWidth: "75%", 
                          borderRadius: isSender ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
                          boxShadow: "0 3px 15px rgba(0,0,0,0.1)"
                        }}
                      >
                        <div style={{ wordBreak: "break-word" }}>{msg.content}</div>
                        <div 
                          className={`text-end ${isSender ? 'text-white-50' : 'text-muted'}`}
                          style={{ fontSize: "0.7rem", marginTop: "4px" }}
                        >
                          {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                      
                      {isSender && (
                        <div 
                          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white ms-2 align-self-end"
                          style={{ width: "30px", height: "30px", minWidth: "30px", fontSize: "0.8rem" }}
                        >
                          {loggedUser.username ? loggedUser.username.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </>
        )}
      </div>
      
      {/* Message Input */}
      <div 
        className="card-footer p-3"
        style={{
          background: "white",
          borderTop: "1px solid rgba(0,0,0,0.1)"
        }}
      >
        <div className="d-flex align-items-end">
          <motion.button
            className="btn btn-light rounded-circle me-2 d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaRegSmile style={{ fontSize: "1.2rem", color: "#6c757d" }} />
          </motion.button>
          
          <motion.button
            className="btn btn-light rounded-circle me-2 d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPaperclip style={{ fontSize: "1.2rem", color: "#6c757d" }} />
          </motion.button>
          
          <div className="flex-grow-1 me-2">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="form-control"
              placeholder="Type a message..."
              style={{ 
                resize: "none", 
                height: "50px", 
                borderRadius: "25px",
                padding: "12px 20px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                border: "1px solid #e9ecef"
              }}
              rows="1"
            />
          </div>
          
          <motion.button
            onClick={sendMessage}
            disabled={isLoading || !newMessage.trim()}
            className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
            style={{ 
              width: "50px", 
              height: "50px",
              background: "linear-gradient(45deg, #1e3c72, #2a5298)",
              border: "none",
              boxShadow: "0 4px 15px rgba(30, 60, 114, 0.4)"
            }}
            whileHover={{ scale: 1.05, boxShadow: "0 6px 20px rgba(30, 60, 114, 0.5)" }}
            whileTap={{ scale: 0.95 }}
          >
            {isLoading ? (
              <FaSpinner className="spinner" style={{ fontSize: "1.2rem" }} />
            ) : (
              <FaRegPaperPlane style={{ fontSize: "1.2rem" }} />
            )}
          </motion.button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .spinner {
          animation: spin 1s linear infinite;
        }
        
        /* Custom scrollbar */
        #messages-container::-webkit-scrollbar {
          width: 6px;
        }
        
        #messages-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        #messages-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }
        
        #messages-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </motion.div>
  );
};

export default Messaging;