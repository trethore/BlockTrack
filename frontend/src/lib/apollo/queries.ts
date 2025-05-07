import { gql } from '@apollo/client';

// --- QUERIES ---


export const GET_ME = gql`
  query Me {
    me {
      id
      username
      email
      createdAt
      updatedAt
      # Si tu veux les favoris ici, décommente
      # favorites {
      #   id
      #   symbol
      #   name
      # }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserData: UpdateUserInput!) {
    updateUser(updateUserData: $updateUserData) {
      id
      username
      email
      updatedAt # Demander updatedAt pour confirmer la mise à jour
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) # Renvoie l'ID de l'utilisateur supprimé
  }
`;

export const IS_TOKEN_VALID = gql`
  query IsTokenValid {
    isTokenValid
  }
`;

export const LOGIN_USER = gql`
  mutation Login($loginData: LoginInput!) {
    login(loginData: $loginData) {
      accessToken
    }
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($createUserData: CreateUserInput!) {
    createUser(createUserData: $createUserData) {
      accessToken
    }
  }
`;
