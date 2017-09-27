const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  interface Payload {
    status: String!
    message: String!
  }
  
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
    uploadedBy: ID!
    fileName: String!
    fileType: String!
    fileSize: Int!
    status: String!
    case: String!
    Amount: Float!
    Date: String!
  }
  
  type Authentication {
    authenticated: Boolean!
    message: String!
    person: Person
    access_token: String
  }
  
  type Persons implements Payload {
    status: String!
    message: String!
    persons: [Person]
  }
  
  type Records implements Payload {
    status: String!
    message: String!
    records: [Record]
  }

  type Query {
    allPersons(skip: Int!, limit: Int!): Persons!
    allRecords(skip: Int!, limit: Int!): Records!
    authenticatePerson(email: String!, password: String!): Authentication!
    personById(id: String!): Persons!
  }
  
  type Mutation {
    createPerson(name: String!, email: String!, phone: String!, password: String!): Authentication!
    authenticatePerson(email: String!, password: String!): Authentication!
    createRecord(url: String!, description: String!): [Record!]!
  }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});