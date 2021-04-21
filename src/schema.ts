import path from "path";
import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync } from "@graphql-tools/load-files";
import { makeExecutableSchema } from "graphql-tools";
import { GraphQLSchema } from "graphql";

class Schema {
  private typesDefsArray: any;
  private resolversArray: any;
  private typeDefs: any;
  private resolvers: any;

  constructor() {
    this.loadFiles();
    this.merge();
  }

  private loadFiles(): void {
    const typesDefsPath: string = path.join(__dirname, "./graphql");
    const resolversPath: string = path.join(__dirname, "./graphql");

    this.typesDefsArray = loadFilesSync(typesDefsPath, {
      extensions: ["graphql", "gql"],
    });
    this.resolversArray = loadFilesSync(resolversPath, {
      extensions: ["ts", "js"],
    });
  }

  private merge(): void {
    this.typeDefs = mergeTypeDefs(this.typesDefsArray);
    this.resolvers = mergeResolvers(this.resolversArray);
  }

  public createSchema(): GraphQLSchema {
    return makeExecutableSchema({
      typeDefs: this.typeDefs,
      resolvers: this.resolvers,
    });
  }
}

export default Schema;
