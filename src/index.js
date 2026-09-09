const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { createHandler } = require("graphql-http/lib/use/express");
const schema = require("./graphql/schemas");
const rootValue = require("./graphql/resolvers");
const pool = require("./config/db");

const app = express();
const port = Number(process.env.PORT || 4000);
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) =>
  res.json({ status: "ok", service: "usuarios-graphql" }),
);
app.all("/graphql", createHandler({ schema, rootValue }));

async function start() {
  try {
    await pool.query("SELECT 1");
    app.listen(port, () =>
      console.log(`Servicio en http://localhost:${port}/graphql`),
    );
  } catch (error) {
    console.error("No fue posible conectar con MySQL:", error.message);
    process.exit(1);
  }
}
start();
