import { gql } from '@apollo/client';

export const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      description
      category
      progress
      startDate
      endDate
    }
  }
`;

export const ADD_PROJECT = gql`
  mutation AddProject(
    $title: String!
    $description: String
    $category: String!
    $progress: Int
    $startDate: String
    $endDate: String
  ) {
    addProject(
      title: $title
      description: $description
      category: $category
      progress: $progress
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      title
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id)
  }
`;
