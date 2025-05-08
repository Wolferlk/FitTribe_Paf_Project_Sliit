import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChatApp = () => {
  const [profiles, setProfiles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Fetch all user profiles
  useEffect(() => {
    axios.get('http://localhost:8080/api/users')
      
      .then(res => setProfiles(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch messages when user is selected
  useEffect(() => {
    if (selectedUser && selectedUser.conversationId) {
      axios.get(`/api/messages/conversation/${selectedUser.conversationId}`)
        .then(res => setMessages(res.data))
        .catch(err => console.error(err));
    }
  }, [selectedUser]);

  // Handle sending a new message
  const sendMessage = () => {
    if (!newMessage.trim()) return;

    axios.post('http://localhost:8080/api/messages/send', {
      conversationId: selectedUser.conversationId,
      senderId: 1, // Replace with actual logged-in user ID
      content: newMessage
    })
    .then(() => {
      setMessages(prev => [...prev, {
        senderId: 1,
        content: newMessage,
        read: false,
        timestamp: new Date()
      }]);
      setNewMessage('');
    })
    .catch(err => console.error(err));
  };

  return (
    <div style={{ display: 'flex', padding: 20 }}>
      {/* Profile list */}
      <div style={{ width: '30%', borderRight: '1px solid gray', paddingRight: 10 }}>
        <h3>All Profiles</h3>
        {profiles.map(user => (
          <div
            key={user.id}
            style={{
              padding: 10,
              cursor: 'pointer',
              backgroundColor: selectedUser?.id === user.id ? '#ddd' : 'transparent'
            }}
            onClick={() => setSelectedUser(user)}
          >
            {user.username}
          </div>
        ))}
      </div>

      {/* Chat area */}
      <div style={{ width: '70%', paddingLeft: 10 }}>
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.name}</h3>
            <div style={{ height: 300, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
              {messages.map((msg, index) => (
                <div key={index} style={{ marginBottom: 10 }}>
                  <strong>{msg.senderId === 1 ? 'You' : selectedUser.name}:</strong> {msg.content}
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message"
                style={{ width: '80%' }}
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a profile to start chatting.</p>
        )}
      </div>
    </div>
  );
};

export default ChatApp;
