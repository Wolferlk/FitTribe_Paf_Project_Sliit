import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Messaging = ({ currentUser }) => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showNewConversationModal, setShowNewConversationModal] = useState(false);
  const [newContactUsername, setNewContactUsername] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const stompClient = useRef(null);

  // Styles
  const styles = {
    container: {
      display: 'flex',
      height: '80vh',
      border: '1px solid #e0e0e0',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.05)',
      backgroundColor: '#fff',
    },
    sidebar: {
      width: '30%',
      borderRight: '1px solid #e0e0e0',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafc',
    },
    searchContainer: {
      padding: '15px',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
    },
    searchInput: {
      flex: 1,
      padding: '10px 15px',
      borderRadius: '20px',
      border: '1px solid #e0e0e0',
      outline: 'none',
      fontSize: '14px',
      backgroundColor: '#fff',
    },
    addButton: {
      marginLeft: '10px',
      padding: '0 15px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    conversationList: {
      flex: 1,
      overflowY: 'auto',
      padding: '0',
    },
    conversationItem: {
      padding: '15px',
      display: 'flex',
      alignItems: 'center',
      borderBottom: '1px solid #f0f0f0',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    activeConversation: {
      backgroundColor: '#e7f0ff',
      borderLeft: '4px solid #3b82f6',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      marginRight: '15px',
      backgroundColor: '#3b82f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
    },
    onlineIndicator: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#10b981',
      marginLeft: '5px',
    },
    offlineIndicator: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: '#9ca3af',
      marginLeft: '5px',
    },
    chatArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    chatHeader: {
      padding: '15px 20px',
      borderBottom: '1px solid #e0e0e0',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    chatMessages: {
      flex: 1,
      overflowY: 'auto',
      padding: '20px',
      backgroundColor: '#f9fafc',
    },
    messageItem: {
      marginBottom: '15px',
      maxWidth: '70%',
      padding: '10px 15px',
      borderRadius: '18px',
      position: 'relative',
      wordBreak: 'break-word',
    },
    sentMessage: {
      backgroundColor: '#3b82f6',
      color: 'white',
      alignSelf: 'flex-end',
      marginLeft: 'auto',
      borderBottomRightRadius: '4px',
    },
    receivedMessage: {
      backgroundColor: '#f3f4f6',
      color: '#1f2937',
      alignSelf: 'flex-start',
      borderBottomLeftRadius: '4px',
    },
    timestamp: {
      fontSize: '12px',
      opacity: 0.7,
      marginTop: '5px',
      textAlign: 'right',
    },
    inputArea: {
      padding: '15px',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      backgroundColor: '#ffffff',
    },
    messageInput: {
      flex: 1,
      padding: '12px 15px',
      borderRadius: '20px',
      border: '1px solid #e0e0e0',
      outline: 'none',
      fontSize: '14px',
      backgroundColor: '#f9fafc',
    },
    sendButton: {
      marginLeft: '10px',
      padding: '0 15px',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      color: '#9ca3af',
    },
    userName: {
      fontWeight: 'bold',
      fontSize: '16px',
    },
    lastMessage: {
      fontSize: '14px',
      color: '#6b7280',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '200px',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '20px',
      width: '400px',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
    },
    inputGroup: {
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontSize: '14px',
      color: '#4b5563',
    },
    input: {
      width: '100%',
      padding: '10px',
      borderRadius: '4px',
      border: '1px solid #e0e0e0',
      fontSize: '14px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    cancelButton: {
      padding: '8px 16px',
      marginRight: '10px',
      backgroundColor: '#f3f4f6',
      color: '#4b5563',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '14px',
      marginBottom: '15px',
    },
  };

  // Connect to WebSocket
  useEffect(() => {
    if (currentUser) {
      connectWebSocket();
    }
    
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [currentUser]);

  // Fetch conversations on component mount
  useEffect(() => {
    if (currentUser) {
      fetchConversations();
    }
  }, [currentUser]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const connectWebSocket = () => {
    const socket = new SockJS('/api/ws');
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = (frame) => {
      console.log('Connected to WebSocket');
      
      // Subscribe to personal channel for receiving messages
      stompClient.current.subscribe(`/user/${currentUser.id}/queue/messages`, onMessageReceived);
      
      // Subscribe to online status updates
      stompClient.current.subscribe('/topic/presence', onPresenceUpdate);
      
      // Send connection header with userId for the WebSocketEventListener
      const headers = {
        userId: currentUser.id
      };
      
      // Send presence update to server
      stompClient.current.publish({
        destination: '/app/presence',
        headers: headers,
        body: JSON.stringify({ userId: currentUser.id, status: 'ONLINE' })
      });
    };

    stompClient.current.onStompError = (frame) => {
      console.error('STOMP error', frame);
    };

    stompClient.current.activate();
  };

  const onMessageReceived = (payload) => {
    const message = JSON.parse(payload.body);
    console.log('Message received:', message);
    
    // Update messages if it's for the currently selected conversation
    if (selectedConversation && (message.conversationId === selectedConversation.id)) {
      setMessages(prevMessages => [...prevMessages, message]);
    }
    
    // Update the conversation list to show the new message
    updateConversationWithMessage(message);
  };

  const onPresenceUpdate = (payload) => {
    const presenceData = JSON.parse(payload.body);
    console.log('Presence update:', presenceData);
    
    setOnlineUsers(prevOnlineUsers => {
      if (presenceData.status === 'ONLINE') {
        if (!prevOnlineUsers.includes(presenceData.userId)) {
          return [...prevOnlineUsers, presenceData.userId];
        }
        return prevOnlineUsers;
      } else {
        return prevOnlineUsers.filter(id => id !== presenceData.userId);
      }
    });
  };

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/conversations/user/${currentUser.id}`);
      setConversations(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/messages/conversation/${conversationId}?userId=${currentUser.id}`);
      setMessages(response.data);
      setIsLoading(false);
      
      // Mark messages as read
      markMessagesAsRead(conversationId);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async (conversationId) => {
    try {
      await axios.put(`/api/messages/read/conversation/${conversationId}/user/${currentUser.id}`);
      // Update UI to reflect read messages
      updateConversationReadStatus(conversationId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const updateConversationReadStatus = (conversationId) => {
    setConversations(prevConversations => 
      prevConversations.map(conv => 
        conv.id === conversationId 
          ? { ...conv, unreadCount: 0 } 
          : conv
      )
    );
  };

  const updateConversationWithMessage = (message) => {
    setConversations(prevConversations => {
      return prevConversations.map(conv => {
        if (conv.id === message.conversationId) {
          const unreadCount = (selectedConversation?.id !== message.conversationId) ? 
            (conv.unreadCount || 0) + 1 : 0;
          
          return {
            ...conv,
            lastMessage: message.content,
            lastMessageTime: message.timestamp,
            unreadCount
          };
        }
        return conv;
      });
    });
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !selectedConversation) return;

    const newMessage = {
      senderId: currentUser.id,
      conversationId: selectedConversation.id,
      content: messageText.trim(),
      timestamp: new Date().toISOString()
    };

    try {
      // Send message via WebSocket
      stompClient.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(newMessage)
      });
      
      // Add message to UI immediately for sender
      const tempMessage = {...newMessage};
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      
      // Clear input
      setMessageText('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const searchUser = async () => {
    if (!newContactUsername.trim()) {
      setError('Please enter a username');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      const response = await axios.get(`/api/users/search?username=${newContactUsername}`);
      
      if (response.data) {
        // Check if conversation already exists
        const existingConversation = conversations.find(conv => {
          const otherParticipant = getOtherParticipant(conv);
          return otherParticipant && otherParticipant.id === response.data.id;
        });

        if (existingConversation) {
          setSelectedConversation(existingConversation);
          setShowNewConversationModal(false);
          setNewContactUsername('');
        } else {
          createNewConversation(response.data.id);
        }
      } else {
        setError('User not found');
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error searching for user:', error);
      setError('Error searching for user');
      setIsLoading(false);
    }
  };

  const createNewConversation = async (otherUserId) => {
    try {
      const response = await axios.post(`/api/conversations/create?userId1=${currentUser.id}&userId2=${otherUserId}`);
      setConversations(prev => [...prev, response.data]);
      setSelectedConversation(response.data);
      setShowNewConversationModal(false);
      setNewContactUsername('');
    } catch (error) {
      console.error('Error creating conversation:', error);
      setError('Error creating conversation');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOtherParticipant = (conversation) => {
    if (!conversation || !conversation.participants) return {};
    return conversation.participants.find(p => p.id !== currentUser.id) || {};
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const filteredConversations = conversations.filter(conv => {
    const otherParticipant = getOtherParticipant(conv);
    return otherParticipant.name && otherParticipant.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={styles.container}>
      {/* Sidebar with conversations */}
      <div style={styles.sidebar}>
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search conversations..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            style={styles.addButton} 
            onClick={() => setShowNewConversationModal(true)}
          >
            +
          </button>
        </div>
        <div style={styles.conversationList}>
          {isLoading && <div style={{padding: "20px", textAlign: "center"}}>Loading...</div>}
          
          {!isLoading && filteredConversations.length === 0 && (
            <div style={{padding: "20px", textAlign: "center", color: "#6b7280"}}>
              No conversations found
            </div>
          )}
          
          {filteredConversations.map(conversation => {
            const otherParticipant = getOtherParticipant(conversation);
            const isSelected = selectedConversation?.id === conversation.id;
            const isOnline = onlineUsers.includes(otherParticipant.id);
            
            return (
              <div
                key={conversation.id}
                style={{
                  ...styles.conversationItem,
                  ...(isSelected ? styles.activeConversation : {})
                }}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div style={styles.avatar}>
                  {getInitials(otherParticipant.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={styles.userName}>{otherParticipant.name}</span>
                    <div style={isOnline ? styles.onlineIndicator : styles.offlineIndicator}></div>
                  </div>
                  <div style={styles.lastMessage}>
                    {conversation.lastMessage || 'Start a conversation...'}
                  </div>
                </div>
                {conversation.unreadCount > 0 && (
                  <div style={{
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                  }}>
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div style={styles.chatArea}>
        {selectedConversation ? (
          <>
            <div style={styles.chatHeader}>
              <div style={styles.avatar}>
                {getInitials(getOtherParticipant(selectedConversation).name)}
              </div>
              <div>
                <div style={styles.userName}>
                  {getOtherParticipant(selectedConversation).name}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  {onlineUsers.includes(getOtherParticipant(selectedConversation).id) 
                    ? 'Online' 
                    : 'Offline'}
                </div>
              </div>
            </div>
            
            <div style={styles.chatMessages}>
              {isLoading ? (
                <div style={{padding: "20px", textAlign: "center"}}>Loading messages...</div>
              ) : (
                <>
                  {messages.length === 0 && (
                    <div style={{padding: "20px", textAlign: "center", color: "#6b7280"}}>
                      No messages yet. Start the conversation!
                    </div>
                  )}
                  
                  {messages.map((message, index) => {
                    const isSent = message.senderId === currentUser.id;
                    
                    return (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: isSent ? 'flex-end' : 'flex-start',
                          marginBottom: '15px',
                        }}
                      >
                        <div
                          style={{
                            ...styles.messageItem,
                            ...(isSent ? styles.sentMessage : styles.receivedMessage)
                          }}
                        >
                          {message.content}
                          <div style={styles.timestamp}>
                            {formatTimestamp(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div style={styles.inputArea}>
              <input
                type="text"
                placeholder="Type a message..."
                style={styles.messageInput}
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                style={styles.sendButton}
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '50px', marginBottom: '10px' }}>💬</div>
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </div>

      {/* New Conversation Modal */}
      {showNewConversationModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Start New Conversation</h3>
              <button 
                style={styles.closeButton} 
                onClick={() => {
                  setShowNewConversationModal(false);
                  setNewContactUsername('');
                  setError('');
                }}
              >
                &times;
              </button>
            </div>
            
            {error && <div style={styles.errorMessage}>{error}</div>}
            
            <div style={styles.inputGroup}>
              <label style={styles.label} htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                style={styles.input}
                value={newContactUsername}
                onChange={(e) => setNewContactUsername(e.target.value)}
                placeholder="Enter username"
                disabled={isLoading}
              />
            </div>
            
            <div style={styles.buttonGroup}>
              <button 
                style={styles.cancelButton}
                onClick={() => {
                  setShowNewConversationModal(false);
                  setNewContactUsername('');
                  setError('');
                }}
              >
                Cancel
              </button>
              <button 
                style={styles.sendButton}
                onClick={searchUser}
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Start Chat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messaging;