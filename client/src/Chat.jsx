// client/src/Chat.js
import "./App.css"
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function Chat() {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);

    const sendMessage = () => {
        if (message !== '') {
            const messageData = {
                message,
            };

            // Emit the message to the server
            socket.emit('send_message', messageData);
            setMessage(''); // Clear the input field
        }
    };

    useEffect(() => {
        // Listen for the "receive_message" event and update the message list
        socket.on('receive_message', (data) => {
            setMessageList((prev) => [...prev, data]);
        });

        // Clean up the listener when the component unmounts
        return () => {
            socket.off('receive_message');
        };
    }, []);

    return (
        <div className="chat">
            <div className="chat-container">
                {messageList.map((msg, index) => (
                    <div key={index} className="message">
                        {msg.message}
                    </div>
                    
                ))}
            </div>
            <div className="field">
            <input
                type="text"
                value={message}
                placeholder="Enter message"
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chat;
