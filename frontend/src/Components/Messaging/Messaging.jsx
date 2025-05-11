import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";

// Define your API base URL as a constant
const API_BASE_URL = "http://localhost:8080/api";

const Messaging = () => {
  const myUser = useSelector((state) => state.user.user);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/users`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      setUsers(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setIsLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    if (!myUser?.id || !userId) return;
    
    try {
      setIsLoading(true);
      setSelectedUser(userId);
      
      const res = await axios.get(`${API_BASE_URL}/messages/${myUser.id}/${userId}`, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
      
      setMessages(res.data
      );
      console.log("Messages fetched:", res.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setIsLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedUser || !myUser?.id) return;
    
    try {
      setIsLoading(true);
      
      await axios.post(`${API_BASE_URL}/messages/send`, {
        senderId: myUser.id,
        receiverId: selectedUser,
        content: message.trim(),
      }, {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
      
      setMessage("");
      await fetchMessages(selectedUser);
      setIsLoading(false);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Find the selected user name
  const selectedUserName = users.find(user => user.id === selectedUser)?.username;

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      {/* Sidebar with users */}
      <div className={`w-1/4 p-4 border-r ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-lg font-bold">Contacts</h4>
          <button 
            onClick={toggleDarkMode} 
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-800'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        {isLoading && users.length === 0 ? (
          <div className="flex justify-center mt-10">
            <div className={`animate-pulse h-6 w-24 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          </div>
        ) : (
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-120px)]">
            {users.map(user => (
              <button 
                key={user.id} 
                onClick={() => fetchMessages(user.id)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center ${
                  selectedUser === user.id
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 hover:bg-gray-600' 
                      : 'bg-white hover:bg-gray-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="truncate">{user.username}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-grow flex flex-col">
        {/* Chat header */}
        <div className={`p-4 border-b ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          {selectedUser ? (
            <h4 className="text-lg font-bold">{selectedUserName || 'Chat'}</h4>
          ) : (
            <h4 className="text-lg font-bold">Select a contact to start chatting</h4>
          )}
        </div>

        {/* Messages area */}
        <div className={`flex-grow p-4 overflow-y-auto ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          {isLoading && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className={`w-8 h-8 border-4 border-t-blue-500 rounded-full animate-spin ${
                isDarkMode ? 'border-gray-700' : 'border-gray-300'
              }`}></div>
              <p className="mt-2 text-sm">Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.senderId === myUser?.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                      msg.senderId === myUser?.id
                        ? isDarkMode 
                          ? 'bg-blue-600 text-white rounded-br-none' 
                          : 'bg-blue-500 text-white rounded-br-none'
                        : isDarkMode
                          ? 'bg-gray-700 text-white rounded-bl-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                    <div className={`text-xs mt-1 ${
                      msg.senderId === myUser?.id
                        ? isDarkMode ? 'text-blue-300' : 'text-blue-200'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : selectedUser ? (
            <div className="flex items-center justify-center h-full">
              <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No messages yet. Start a conversation!
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Select a user to start messaging
              </p>
            </div>
          )}
        </div>

        {/* Message input */}
        {selectedUser && (
          <form 
            onSubmit={sendMessage}
            className={`p-4 border-t flex ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
          >
            <input 
              type="text" 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`flex-grow p-3 rounded-l-lg focus:outline-none ${
                isDarkMode 
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-blue-500' 
                  : 'bg-gray-100 border-gray-200 focus:ring-2 focus:ring-blue-500'
              }`}
              placeholder="Type a message..."
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading || !message.trim()}
              className={`px-6 rounded-r-lg transition-colors ${
                isLoading || !message.trim()
                  ? isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-400'
                  : isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isLoading ? (
                <span className="inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
              ) : (
                'Send'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Messaging;