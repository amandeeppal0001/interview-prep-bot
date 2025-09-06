import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Great, let's begin. Tell me about a challenging project you worked on and how you handled it."
    },
    {
      sender: 'user',
      text: "Certainly. In my previous role, I was tasked with refactoring a legacy codebase to improve performance. The main challenge was..."
    },
    {
      sender: 'bot',
      text: "Thank you for that detailed answer. How do you handle conflict within your team?"
    }
  ]);
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      setMessages([...messages, { sender: 'user', text: input.trim() }]);
      setInput('');
      // In a real application, you would send this message to the bot and get a response.
      // For this example, we'll just add a placeholder bot response.
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { sender: 'bot', text: 'Thank you for that detailed answer. How do you handle conflict within your team?' }]);
      }, 1000);
    }
  };

  const handleSubmitInterview = () => {
    // Redirect to the evaluation page
    navigate('/evaluation');
  };

  return (
    // ml-20 gives space for the fixed sidebar
    <main className="flex-grow bg-white p-6 ml-20"> 
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Interview Room</h1>

      {/* Chat Messages */}
      <div className="space-y-6 mb-8 max-h-[calc(100vh-250px)] overflow-y-auto pr-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-lg max-w-2xl ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              <p className="font-semibold">{msg.sender === 'user' ? 'You:' : 'AI Interviewer:'}</p>
              <p className="mt-1">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-20 right-0 bg-white p-6 shadow-top border-t border-gray-200">
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          rows="3"
          placeholder="Type your answer here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        ></textarea>
        <div className="flex justify-end mt-4 space-x-3">
          <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition">
            Skip
          </button>
          <button 
            className="px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition"
            onClick={handleSubmitInterview} // Changed from 'Submit' to this button
          >
            Submit Interview
          </button>
        </div>
      </div>
    </main>
  );
}

export default ChatPanel;