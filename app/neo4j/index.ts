import neo4j from 'neo4j-driver'
import { Neo4jGraphQL } from '@neo4j/graphql'
import { ApolloServer, gql } from 'apollo-server'

// (You may need to replace your connection details, username and password)
const AURA_ENDPOINT = 'neo4j+s://0229234b.databases.neo4j.io'
const USERNAME = 'neo4j'
const PASSWORD = 'Y5NmkjdP3AeK7g98G2aFkwBSl9uQpzTQKx8T6cJ9N7g'

// Create Neo4j driver instance
const driver = neo4j.driver(AURA_ENDPOINT, neo4j.auth.basic(USERNAME, PASSWORD))

const typeDefs = gql`
  type Person {
    name: String
    knows: [Person!]! @relationship(type: "KNOWS", direction: OUT)
    friendCount: Int
      @cypher(statement: "RETURN SIZE((this)-[:KNOWS]->(:Person))")
  }
`

// Create instance that contains executable GraphQL schema from GraphQL type definitions
const neo4jGraphQL = new Neo4jGraphQL({
  typeDefs,
  driver,
})

// Generate schema
neo4jGraphQL.getSchema().then(schema => {
  // Create ApolloServer instance to serve GraphQL schema
  const server = new ApolloServer({
    schema,
    context: { driverConfig: { database: 'neo4j' } },
  })

  // Start ApolloServer
  server.listen().then(something => {
    console.log(`GraphQL server ready at ${something.url}`)
  })
})
