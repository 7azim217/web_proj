import React from 'react';
import { format } from 'date-fns';
import { Message } from '../../types';
import useAuthStore from '../../store/authStore';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuthStore();
  const isSender = message.senderId === user?.username;

  let formattedTime = 'Invalid';
  if (message.timestamp && !isNaN(Date.parse(message.timestamp))) {
    formattedTime = format(new Date(message.timestamp), 'h:mm a');
  }

  return (
    <div className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isSender
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-gray-700 text-white rounded-tl-none'
        }`}
      >
        <div className="text-sm mb-1">{message.content}</div>
        <div className="text-xs opacity-70 text-right">{formattedTime}</div>
      </div>
    </div>
  );
};

export default ChatMessage;
