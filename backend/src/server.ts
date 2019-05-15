import * as express from "express";
import * as mongoose from "mongoose";
import { init } from "./initializer";
import { userRouter } from "./routes/userRouter";
import data from "./data";

const app = express();
init(data);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/users", userRouter);

//catch-all route
app.use("/", (request, response) => {
  response.send("Welcome to Spring 2019 DU Project");
});

mongoose.connect("mongodb://localhost:27017/users", { useNewUrlParser: true });
mongoose.connection.on("connected", () => {
  console.log("Connected to users DB");
});
mongoose.connection.on("error", err => {
  console.log(err);
});

const port = process.env.PORT || 4444;
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});