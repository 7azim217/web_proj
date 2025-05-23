import React, { useEffect, useState, useRef } from 'react';
import useAuthStore from '../../store/authStore';
import useDataStore from '../../store/dataStore';
import Button from '../../components/ui/Button';

const ChatPage: React.FC = () => {
  const { user } = useAuthStore();
  const {
    directChats,
    messages,
    fetchDirectChats,
    fetchChatMessages,
    sendDirectMessage,
  } = useDataStore();

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchDirectChats();
  }, [fetchDirectChats]);

  useEffect(() => {
    if (activeChatId) {
      fetchChatMessages(activeChatId);
    }
  }, [activeChatId, fetchChatMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (activeChatId && messageText.trim()) {
      await sendDirectMessage({ chatId: activeChatId, content: messageText });
      setMessageText('');
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-800 p-4 overflow-y-auto border-r border-gray-700">
        <h2 className="text-xl text-white font-bold mb-4">Conversations</h2>
        {directChats.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 rounded cursor-pointer text-white ${
              activeChatId === chat.id ? 'bg-blue-600' : 'hover:bg-gray-700'
            }`}
            onClick={() => setActiveChatId(chat.id)}
          >
            {chat.other_user}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {activeChatId ? (
          <>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 max-w-[70%] px-4 py-2 rounded-lg ${
                    msg.senderId === user?.id
                      ? 'bg-blue-500 text-white ml-auto'
                      : 'bg-gray-700 text-white mr-auto'
                  }`}
                >
                  <div>{msg.content}</div>
                  <div className="text-xs opacity-70 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-700 p-4">
              <div className="flex">
                <textarea
                  className="flex-1 bg-gray-800 text-white rounded-l px-3 py-2 resize-none"
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={1}
                />
                <Button onClick={handleSendMessage} className="rounded-l-none">
                  Send
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
