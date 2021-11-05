const express = require("express");
const NodeCache = require("node-cache");
const https = require("https");
const myCache = new NodeCache({ stdTTL: 10 });
const app = express();
const port = 3000;

const todosURL = "https://jsonplaceholder.typicode.com/todos";

app.get("/", (req, res) => {
  if (myCache.has("todos")) {
    res.send(myCache.get("todos"));
  } else {
    try {
      https.get(todosURL, (resp) => {
        let data = "";
        resp.on("data", (chunk) => {
          data += chunk;
        });
        resp.on("end", () => {
          const todos = JSON.parse(data);
          myCache.set("todos", todos);
          res.send(todos);
        });
      });
    } catch (err) {
      res.send(err);
    }
  }
});

app.listen(port, () => {
  console.log("Server started");
});
