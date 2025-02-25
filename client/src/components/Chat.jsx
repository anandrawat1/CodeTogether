import React, { useState } from 'react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: 'You' }]);
      //socket event  (message,sendername)//emie
      //listen backend(emit)(message,name)
      //listen(append div)(array update)   //open useeefect(message)
      setNewMessage('');
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-800 text-white w-96 overflow-hidden">
      <div className="p-4 flex-shrink-0">
        <h2 className="text-xl font-semibold">Group Chat</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((message, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-3">
            <p className="text-sm font-semibold">{message.sender}</p>
            <p className="text-gray-300 break-words">{message.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4  flex-shrink-0">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 min-w-0 bg-gray-700 text-white rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2.5 rounded hover:bg-green-600 transition-colors whitespace-nowrap flex-shrink-0 font-medium"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 