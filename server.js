const dotenv = require("dotenv");
dotenv.config();
const htpp = require("http");
const mongoose = require("mongoose");

const connectionString = process.env.MONGO_URL;

mongoose.connect(
  connectionString,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err, goose) => {
    if (err) console.log("Error on connection MongoDB");
    else {
      console.log("MongoDB is connected succesafully");
      //   console.log(client);
      //   module.exports = client;
      //   console.log(goose);
      const app = require("./app");
      const server = htpp.createServer(app);
      let PORT = process.env.PORT || 3005;
      server.listen(PORT, function () {
        console.log(
          `The server is running successfully on port: ${PORT}, http//localhost:${PORT} `
        );
      });
    }
  }
);
