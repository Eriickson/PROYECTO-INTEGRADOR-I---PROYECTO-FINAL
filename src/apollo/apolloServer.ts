import { ApolloServer } from "apollo-server-express";
import { graphqlUploadExpress } from "graphql-upload";
import app from "../config/app";

// Importamos el schema
import Schema from "../schema";

app.use(graphqlUploadExpress({ maxFileSize: 1000000000, maxFiles: 25 }));

// Creamos el servidor de apollo
const apolloServer = new ApolloServer({
  uploads: false,
  schema: new Schema().createSchema(),
  introspection: true,
  playground: true,
  context: ({ req }) => {
    return {
      headers: req.headers,
    };
  },
  formatError: err => ({ message: err.message }),
});

export { app, apolloServer };
