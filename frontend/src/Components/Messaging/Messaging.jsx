import React, { useState, useEffect, useRef } from 'react';
import { FaEllipsisH, FaPaperPlane, FaSmile, FaPaperclip } from 'react-icons/fa';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const Messaging = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [activeTab, setActiveTab] = useState('chats'); // 'chats' or 'users'
  
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);
  const messageListRef = useRef(null);

  // Assume the current user's ID is stored in localStorage or passed as a prop
  const authToken = localStorage.getItem('token');
  const currentUserId = localStorage.getItem('userId');

  const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    },
    withCredentials: true
  });

  useEffect(() => {
    // Fetch current user data
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${currentUserId}`);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    // Fetch all users
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users');
        setUsers(response.data.filter(user => user.id !== currentUserId));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    // Fetch user conversations
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/conversations/user/${currentUserId}`);
        setConversations(response.data);
        setLoading(false);
        console.error("Error fetching conversations:", response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      }
    };

    // Set up WebSocket connection
    const setupWebSocket = () => {
      const socket = new SockJS('http://localhost:8080/ws');
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.debug(str),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        connectHeaders: {
          'Authorization': `Bearer ${authToken}`
        },
        beforeConnect: () => {
          socket.url += `?access_token=${authToken}`;
        }
      });

      stompClient.current.onConnect = (frame) => {
        stompClient.current.subscribe(
          `/user/${currentUserId}/queue/messages`,
          onMessageReceived,
          { 'Authorization': `Bearer ${authToken}` }
        );
        
        stompClient.current.subscribe(
          '/topic/presence',
          onPresenceUpdate,
          { 'Authorization': `Bearer ${authToken}` }
        );
        
        sendPresence('ONLINE');
      };

      stompClient.current.onStompError = (frame) => {
        console.error('STOMP error:', frame.headers.message, frame.body);
      };

      stompClient.current.activate();
    };

    fetchCurrentUser();
    fetchUsers();
    fetchConversations();
    setupWebSocket();

    // Clean up WebSocket connection
    return () => {
      if (stompClient.current?.connected) {
        sendPresence('OFFLINE');
        stompClient.current.deactivate();
      }
    };
  }, [currentUserId]);




  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    
    if (selectedConversation && message.conversationId === selectedConversation.id) {
      setMessages(prevMessages => [...prevMessages, message]);
      
      // Mark message as read
      markMessagesAsRead(message.conversationId);
    }
    
    // Update conversations list with new message
    updateConversationWithMessage(message);
  };

  const onPresenceUpdate = (payload) => {
    const presenceInfo = JSON.parse(payload.body);
    if (presenceInfo.status === 'ONLINE') {
      setOnlineUsers(prev => new Set([...prev, presenceInfo.userId]));
    } else {
      setOnlineUsers(prev => {
        const updated = new Set([...prev]);
        updated.delete(presenceInfo.userId);
        return updated;
      });
    }
  };

  const sendPresence = (status) => {
    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.publish({
        destination: '/app/presence',
        body: JSON.stringify({
          userId: currentUserId,
          status: status
        })
      });
    }
  };

  const updateConversationWithMessage = (message) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === message.conversationId) {
          return {
            ...conv,
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
            unreadCount: selectedConversation && selectedConversation.id === conv.id ? 0 : conv.unreadCount + 1
          };
        }
        return conv;
      });
    });
  };

  const selectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setLoading(true);
    
    try {
      const response = await axios.get(`http://localhost:8080/api/messages/conversation/${conversation.id}`, {
        params: { userId: currentUserId }
      });
      setMessages(response.data);
      
      // Mark messages as read
      markMessagesAsRead(conversation.id);
      
      // Update unread count in conversation list
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.id === conversation.id) {
            return { ...conv, unreadCount: 0 };
          }
          return conv;
        });
      });
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      await axios.put(`http://localhost:8080/api/messages/read/conversation/${conversationId}/user/${currentUserId}`);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const startNewConversation = async (userId) => {
    try {
      setLoading(true);
      const response = await api.post(`http://localhost:8080/api/conversations/create`, null, {
        params: {
          userId1: currentUserId,
          userId2: userId
        }
        
      });
      
      // Check if this conversation already exists in our list
      const conversationExists = conversations.some(conv => conv.id === response.data.id);
      
      if (!conversationExists) {
        setConversations(prev => [...prev, response.data]);
      }
      
      setSelectedConversation(response.data);
      setMessages([]);
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedConversation) return;
    
    const messageData = {
      senderId: currentUserId,
      conversationId: selectedConversation.id,
      content: newMessage,
      timestamp: new Date(),
      read: false
    };
    
    try {
      // Send via WebSocket
       if (stompClient.current?.connected) {
        stompClient.current.publish({
          destination: '/app/chat',
          body: JSON.stringify(messageData),
          headers: { 'Authorization': `Bearer ${authToken}` }
        });
      }
      
      // Also send via REST API as backup
      const response = await api.post('http://localhost:8080/api/messages', messageData);
      
      // Update local messages state
      setMessages(prev => [...prev, response.data]);
      
      // Update conversation in the list
      updateConversationWithMessage(response.data);
      
      // Clear input
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return null;
    return conversation.participants.find(p => p.id !== currentUserId);
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };
  
  const getRandomColor = (userId) => {
    // Generate a consistent color based on userId
    const colors = [
      'primary', 'info', 'success', 'warning', 'danger', 'secondary'
    ];
    
    if (!userId) return colors[0];
    const index = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-4">
        <div className="row g-0">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-3 h-100">
              <div className="card-header bg-primary text-white border-0 p-3">
                <h5 className="mb-0 fw-bold">Messages</h5>
              </div>
              
              {/* Tabs */}
              <div className="d-flex">
                <div 
                  className={`w-50 text-center py-3 ${activeTab === 'chats' ? 'border-bottom border-primary border-3' : ''}`} 
                  onClick={() => setActiveTab('chats')}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  <h6 className={`mb-0 ${activeTab === 'chats' ? 'text-primary fw-bold' : ''}`}>Chats</h6>
                </div>
                <div 
                  className={`w-50 text-center py-3 ${activeTab === 'users' ? 'border-bottom border-primary border-3' : ''}`}
                  onClick={() => setActiveTab('users')}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  <h6 className={`mb-0 ${activeTab === 'users' ? 'text-primary fw-bold' : ''}`}>Tribe Members</h6>
                </div>
              </div>
              
              {/* Search box */}
              <div className="p-3 border-bottom">
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control rounded-pill" 
                    placeholder="Search conversations..." 
                  />
                </div>
              </div>
              
              {/* Conversations Tab Content */}
              <div className={`${activeTab === 'chats' ? 'd-block' : 'd-none'}`} style={{ height: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                {loading ? (
                  <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-comments text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <p className="text-muted">No conversations yet. <br/>Start by selecting a fitness tribe member to chat with.</p>
                  </div>
                ) : (
                  conversations.map(conversation => {
                    const otherUser = getOtherParticipant(conversation);
                    const userColor = getRandomColor(otherUser?.id);
                    
                    return (
                      <div 
                        key={conversation.id}
                        className={`p-3 border-bottom d-flex align-items-center ${selectedConversation && selectedConversation.id === conversation.id ? 'bg-light' : ''}`}
                        onClick={() => selectConversation(conversation)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      >
                        <div style={{ position: 'relative' }}>
                          <div className={`bg-${userColor} text-white d-flex align-items-center justify-content-center`} 
                            style={{ width: '45px', height: '45px', borderRadius: '50%' }}>
                            {getInitials(otherUser?.username)}
                          </div>
                          {onlineUsers.has(otherUser?.id) && (
                            <div style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#28a745',
                              position: 'absolute',
                              bottom: '2px',
                              right: '2px',
                              border: '2px solid white'
                            }}></div>
                          )}
                        </div>
                        
                        <div className="ms-3 flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0">{otherUser ? otherUser.username : 'Unknown User'}</h6>
                            <small className="text-muted">{formatTime(conversation.lastMessageTime)}</small>
                          </div>
                          <div className="d-flex justify-content-between align-items-center">
                            <p className="mb-0 text-truncate text-muted" style={{ maxWidth: '180px', fontSize: '0.85rem' }}>
                              {conversation.lastMessage || 'No messages yet'}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="badge bg-primary rounded-pill">{conversation.unreadCount}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              
              {/* Users Tab Content */}
              <div className={`${activeTab === 'users' ? 'd-block' : 'd-none'}`} style={{ height: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                <div className="p-3 border-bottom">
                  <h6 className="text-muted mb-3">Fitness Tribe Members</h6>
                  
                  {users.map(user => {
                    const userColor = getRandomColor(user.id);
                    
                    return (
                      <div 
                        key={user.id}
                        className="d-flex align-items-center mb-3 p-2 rounded-3 hover-shadow"
                        onClick={() => startNewConversation(user.id)}
                        style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                      >
                        <div style={{ position: 'relative' }}>
                          <div className={`bg-${userColor} text-white d-flex align-items-center justify-content-center`} 
                            style={{ width: '45px', height: '45px', borderRadius: '50%' }}>
                            {getInitials(user.username)}
                          </div>
                          {onlineUsers.has(user.id) && (
                            <div style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#28a745',
                              position: 'absolute',
                              bottom: '2px',
                              right: '2px',
                              border: '2px solid white'
                            }}></div>
                          )}
                        </div>
                        
                        <div className="ms-3">
                          <h6 className="mb-0">{user.username}</h6>
                          <small className={`${onlineUsers.has(user.id) ? 'text-success' : 'text-muted'}`}>
                            {onlineUsers.has(user.id) ? 'Online' : 'Offline'}
                          </small>
                        </div>
                        
                        <div className="ms-auto">
                          <button className="btn btn-sm btn-outline-primary rounded-pill">
                            Message
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Chat Area */}
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3 h-100 ms-lg-3">
              {selectedConversation ? (
                <>
                  {/* Chat header */}
                  <div className="card-header bg-white p-3 d-flex align-items-center justify-content-between">
                    {getOtherParticipant(selectedConversation) && (
                      <div className="d-flex align-items-center">
                        <div style={{ position: 'relative' }}>
                          <div className={`bg-${getRandomColor(getOtherParticipant(selectedConversation)?.id)} text-white d-flex align-items-center justify-content-center`} 
                            style={{ width: '45px', height: '45px', borderRadius: '50%' }}>
                            {getInitials(getOtherParticipant(selectedConversation)?.username)}
                          </div>
                          {onlineUsers.has(getOtherParticipant(selectedConversation)?.id) && (
                            <div style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '50%',
                              backgroundColor: '#28a745',
                              position: 'absolute',
                              bottom: '2px',
                              right: '2px',
                              border: '2px solid white'
                            }}></div>
                          )}
                        </div>
                        <div className="ms-3">
                          <h5 className="mb-0 fw-bold">{getOtherParticipant(selectedConversation)?.username}</h5>
                          <small className={`${onlineUsers.has(getOtherParticipant(selectedConversation)?.id) ? 'text-success' : 'text-muted'}`}>
                            {onlineUsers.has(getOtherParticipant(selectedConversation)?.id) ? 'Online' : 'Offline'}
                          </small>
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <button className="btn btn-light rounded-circle">
                        <FaEllipsisH />
                      </button>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="card-body p-3" style={{ height: 'calc(100vh - 300px)', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
                    {loading ? (
                      <div className="text-center p-4">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center p-5">
                        <div className="mb-4">
                          <i className="fas fa-comment-dots text-primary" style={{ fontSize: '3rem' }}></i>
                        </div>
                        <h5>No messages yet</h5>
                        <p className="text-muted">Send a message to start the conversation with {getOtherParticipant(selectedConversation)?.username}</p>
                      </div>
                    ) : (
                      <div>
                        {messages.map((msg, index) => {
                          const isCurrentUser = msg.senderId === currentUserId;
                          const showDate = index === 0 || 
                            formatDate(messages[index-1].timestamp) !== formatDate(msg.timestamp);
                          
                          return (
                            <div key={msg.id || index}>
                              {showDate && (
                                <div className="text-center my-3">
                                  <span className="badge bg-white text-dark shadow-sm px-3 py-2">{formatDate(msg.timestamp)}</span>
                                </div>
                              )}
                              <div className={`d-flex ${isCurrentUser ? 'justify-content-end' : 'justify-content-start'} mb-3`}>
                                {!isCurrentUser && (
                                  <div className="me-2">
                                    <div className={`bg-${getRandomColor(msg.senderId)} text-white d-flex align-items-center justify-content-center`} 
                                      style={{ width: '35px', height: '35px', borderRadius: '50%' }}>
                                      {getInitials(getOtherParticipant(selectedConversation)?.username)}
                                    </div>
                                  </div>
                                )}
                                <div
                                  className="shadow-sm"
                                  style={{
                                    maxWidth: '75%',
                                    backgroundColor: isCurrentUser ? '#007bff' : 'white',
                                    color: isCurrentUser ? 'white' : 'black',
                                    borderRadius: '18px',
                                    padding: '12px 16px',
                                    animation: 'fadeIn 0.3s ease-in-out',
                                  }}
                                >
                                  <div>{msg.content}</div>
                                  <div className="text-end">
                                    <small className={`${isCurrentUser ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.7rem' }}>
                                      {formatTime(msg.timestamp)}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                  
                  {/* Message input */}
                  <div className="card-footer bg-white border-0 p-3">
                    <form onSubmit={sendMessage}>
                      <div className="input-group">
                        <button className="btn btn-light" type="button">
                          <FaPaperclip />
                        </button>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Type a message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        />
                        <button className="btn btn-light" type="button">
                          <FaSmile />
                        </button>
                        <button className="btn btn-primary rounded-circle ms-2" type="submit">
                          <FaPaperPlane />
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className="d-flex flex-column align-items-center justify-content-center h-100 p-5 text-center">
                  <div className="mb-4">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                      <FaPaperPlane size={32} />
                    </div>
                  </div>
                  <h4 className="fw-bold text-primary">Your Fitness Conversations</h4>
                  <p className="text-muted">Select a fitness tribe member to start chatting about your fitness journey together.</p>
                  <button 
                    className="btn btn-primary rounded-pill mt-3"
                    onClick={() => setActiveTab('users')}
                  >
                    Browse Tribe Members
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .hover-shadow:hover {
          background-color: rgba(0,0,0,0.05);
        }
      `}</style>
    </div>
  );
};

export default Messaging;