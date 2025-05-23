import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USERS, GET_CHATS, START_CHAT, SEND_MESSAGE } from '../graphql/chatQueries';

const ChatPage: React.FC = () => {
  const { data: userData } = useQuery(GET_USERS);
  const { data: chatData, refetch } = useQuery(GET_CHATS);
  const [startChat] = useMutation(START_CHAT);
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleStartChat = async (userId: string) => {
    const res = await startChat({ variables: { participantId: userId } });
    await refetch();
    setSelectedChatId(res.data.startChat.id);
  };

  const handleSend = async () => {
    if (!selectedChatId || !message.trim()) return;
    await sendMessage({ variables: { chatId: selectedChatId, content: message } });
    setMessage('');
    await refetch();
  };

  const selectedChat = chatData?.myChats.find((c: any) => c.id === selectedChatId);

  return (
    <div className="flex h-screen">
      <div className="w-1/4 border-r p-4">
        <h2 className="text-xl font-bold">Students</h2>
        <ul>
          {userData?.users.map((user: any) => (
            <li key={user.id}>
              <button onClick={() => handleStartChat(user.id)}>{user.username}</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 flex flex-col p-4">
        {selectedChat ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4">
              {selectedChat.messages.map((msg: any) => (
                <div key={msg.id}>
                  <strong>{msg.sender.username}</strong>: {msg.content}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                className="flex-1 border p-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={handleSend} className="ml-2 bg-blue-500 text-white px-4">Send</button>
            </div>
          </>
        ) : (
          <p>Select a student to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
