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
      favorites {
        id
      }
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($updateUserData: UpdateUserInput!) {
    updateUser(updateUserData: $updateUserData) {
      id
      username
      email
      updatedAt
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const IS_TOKEN_VALID = gql`
  query IsTokenValid {
    isTokenValid
  }
`;

export const GET_TOKENS_FOR_LEADERBOARD = gql`
  query GetTokensForLeaderboard {
    tokens {
      id
      rank
      name
      symbol
      priceUSD
      marketCapUsd
      marketCapChange24h
      circulatingSupply
      totalSupply
      maxSupply
      percentChange1h
      percentChange24h
      percentChange7d
      percentChange30d
      percentChange1y
    }
  }
`;

export const ADD_FAVORITE_TOKEN = gql`
  mutation AddFavoriteToken($tokenId: ID!) {
    addFavoriteToken(input: { tokenId: $tokenId }) {
      id
    }
  }
`;

export const REMOVE_FAVORITE_TOKEN = gql`
  mutation RemoveFavoriteToken($tokenId: ID!) {
    removeFavoriteToken(input: { tokenId: $tokenId }) {
      id
    }
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
export const GET_TOKEN_DETAILS = gql`
  query GetTokenDetails($id: ID!) {
    token(input: { id: $id }) {
      id
      rank
      name
      symbol
      priceUSD
      marketCapUsd
      marketCapChange24h
      circulatingSupply
      totalSupply
      maxSupply
      percentChange1h
      percentChange24h
      percentChange7d
      percentChange30d
      percentChange1y
      lastUpdated
      dataPoints {
        id
        date
        priceUSD
      }
    }
  }
`;
