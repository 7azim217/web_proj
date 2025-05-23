import { gql } from '@apollo/client';

export const GET_USERS = gql`
  query {
    users {
      id
      username
    }
  }
`;

export const GET_CHATS = gql`
  query {
    myChats {
      id
      participants {
        id
        username
      }
      messages {
        id
        content
        sender {
          id
          username
        }
        timestamp
      }
    }
  }
`;

export const START_CHAT = gql`
  mutation StartChat($participantId: ID!) {
    startChat(participantId: $participantId) {
      id
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: ID!, $content: String!) {
    sendMessage(chatId: $chatId, content: $content) {
      id
      content
      timestamp
      sender {
        id
        username
      }
    }
  }
`;
