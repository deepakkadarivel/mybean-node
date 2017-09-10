const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Person {
    id: ID!
    name: String!
    email: String!
    phone: String!
    password: String!
  }
  
  type Record {
    id: ID!
    url: String!
    description: String!
  }
  
  type Authentication {
    authenticated: Boolean!
    message: String!
    access_token: String
  }

  type Query {
    allPersons(skip: Int!, limit: Int!): [Person!]!
    allRecords(skip: Int!, limit: Int!): [Record!]!
    authenticatePerson(email: String!, password: String!): Authentication!
  }
  
  type Mutation {
    createPerson(name: String!, email: String!, phone: String!, password: String!): [Person!]!
    createRecord(url: String!, description: String!): [Record!]!
  }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});