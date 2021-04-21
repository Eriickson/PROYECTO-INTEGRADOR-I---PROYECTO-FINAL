import mongoose from "mongoose";
mongoose.Promise = global.Promise;

export function startMongoose(): void {
  // mongodb+srv://automarket_testing:Erickson0311@cluster0.hcjvp.mongodb.net/automarket-rd-v2?retryWrites=true&w=majority
  mongoose
    .connect(`${process.env.URI_MONGODB}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Conectada");
    })
    .catch(err => {
      console.log("Error al conectar: ", err);
    });
}
