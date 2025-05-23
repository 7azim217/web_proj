import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    role: String!
  }

  type Project {
    id: ID!
    title: String!
    description: String
    category: String!
    progress: Int!
    startDate: String!
    endDate: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    status: String!
    assignedTo: String!
    projectId: String!
    dueDate: String!
    createdAt: String
  }

  type Message {
    id: ID!
    content: String!
    timestamp: String!
    sender: User!
  }

  type Chat {
    id: ID!
    participants: [User!]!
    messages: [Message!]!
  }

  type Query {
    users: [User!]!
    projects: [Project!]!
    tasks: [Task!]!
    myChats: [Chat!]!
    chatMessages(chatId: ID!): [Message!]!
  }

  type Mutation {
    # Project Mutations
    addProject(
      title: String!
      description: String
      category: String!
      progress: Int
      startDate: String!
      endDate: String!
    ): Project!

    deleteProject(id: ID!): Boolean!

    # Task Mutations
    addTask(
      title: String!
      description: String
      assignedTo: String!
      projectId: String!
      dueDate: String!
    ): Task!

    updateTaskStatus(id: ID!, status: String!): Task!

    # Chat Mutations
    startChat(participantId: ID!): Chat!
    sendMessage(chatId: ID!, content: String!): Message!
  }
`;

export default typeDefs;
