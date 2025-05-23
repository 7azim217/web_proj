import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      description
      status
      assignedTo
      projectId
      dueDate
      createdAt
    }
  }
`;

export const ADD_TASK = gql`
  mutation AddTask(
    $title: String!
    $description: String
    $assignedTo: String!
    $projectId: String!
    $dueDate: String
  ) {
    addTask(
      title: $title
      description: $description
      assignedTo: $assignedTo
      projectId: $projectId
      dueDate: $dueDate
    ) {
      id
      title
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation UpdateTaskStatus($id: ID!, $status: String!) {
    updateTaskStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;
