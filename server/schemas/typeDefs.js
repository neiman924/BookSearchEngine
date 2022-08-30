const { gql } = require('apollo-server-express');

const typeDefs = gql`

  type Book {
    _id: ID!
    bookID: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBook: [Book]
  }

  input savedBook {
    bookID: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Query {
    me: User
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    savedBook(input: savedBook!):User
    removeBook(bookID: ID!):User
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
