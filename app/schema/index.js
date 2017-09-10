const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
  type Record {
    id: ID!
    url: String!
    description: String!
  }

  type Query {
    allRecords: [Record!]!
  }
  
  type Mutation {
    createRecord(url: String!, description: String!): Record
  }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});