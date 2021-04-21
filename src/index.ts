import { createServer } from "http";
import { app, apolloServer } from "./apollo/apolloServer";
import { startMongoose } from "./database";
import { wakeDyno } from "./config";

const httpServer = createServer(app);

apolloServer.applyMiddleware({ app });

httpServer.listen(process.env.PORT || 4000, (): void => {
  startMongoose();
  wakeDyno(String(process.env.HEROKU_DYNO_URL), {
    interval: 29,
    logging: false,
    stopTimes: { start: "03:00", end: "12:00" },
  });

  /* eslint-disable-next-line no-console */
  console.log(`Server: http://localhost:${process.env.PORT || 4000}/graphql`);
});
