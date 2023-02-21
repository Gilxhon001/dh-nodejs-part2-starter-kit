import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";

const app = express();

dotenv.config();

const port = process.env.PORT || 3000;

app.use(morgan("dev"));

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets = [
  { id: 1, name: "Earth" },
  { id: 2, name: "Mars" },
];

app.get("/api/planets", function(req, res) {
  res.status(200).json(planets);
});

app.get("/api/planets/:id", function(req, res) {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  res.status(200).json(planet);
});

app.listen(port, () =>
  console.log(`Example App Listening on port http://localhost:${port}`)
);
