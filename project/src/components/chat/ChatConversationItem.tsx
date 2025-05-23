import React from 'react';
import { format } from 'date-fns';
import { UserIcon } from 'lucide-react';
import { ChatConversation } from '../../types';
import useAuthStore from '../../store/authStore';

interface ChatConversationItemProps {
  conversation: ChatConversation;
  isActive: boolean;
  onClick: () => void;
}

const ChatConversationItem: React.FC<ChatConversationItemProps> = ({
  conversation,
  isActive,
  onClick,
}) => {
  const { user } = useAuthStore();
  const otherParticipant = conversation.participants.find(
    (p) => p !== user?.username
  );

  let formattedTime = 'Invalid';
  if (
    conversation.lastMessageTimestamp &&
    !isNaN(Date.parse(conversation.lastMessageTimestamp))
  ) {
    formattedTime = format(new Date(conversation.lastMessageTimestamp), 'h:mm a');
  }

  return (
    <div
      className={`flex items-center p-3 cursor-pointer transition-colors duration-200 ${
        isActive ? 'bg-gray-700' : 'hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
        <UserIcon size={20} className="text-gray-300" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-white font-medium truncate">{otherParticipant}</h3>
          <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formattedTime}</span>
        </div>

        <div className="flex items-center">
          <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>

          {conversation.unreadCount > 0 && (
            <span className="ml-2 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatConversationItem;
