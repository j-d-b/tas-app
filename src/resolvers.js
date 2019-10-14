import { gql } from 'apollo-boost';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    userRole: String!
    userEmail: String!
  }
`;

export const resolvers = {};