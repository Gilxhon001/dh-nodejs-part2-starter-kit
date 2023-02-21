import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import Joi from "joi";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

dotenv.config();
const port = process.env.PORT || 3000;

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets = [
  { id: 1, name: "Earth" },
  { id: 2, name: "Mars" },
];

const planetSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});

const planetUpdateSchema = Joi.object({
  name: Joi.string().required(),
});

app.get("/api/planets", (req, res) => res.status(200).json(planets));

app.get("/api/planets/:id", function (req, res) {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  if (!planet) {
    return res.status(404).json({ error: "Planet not found" });
  }
  res.status(200).json(planet);
});

app.post("/api/planets", (req, res) => {
  const { error } = planetSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { id, name } = req.body;
  const newPlanet = { id, name };
  planets = [...planets, newPlanet];

  console.log(planets);

  res.status(201).json({ msg: "Planet was created" });
});

app.put("/api/planets/:id", (req, res) => {
  const {id} = req.params ;
  const { error } = planetUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const {name} = req.body ;

  const index = planets.findIndex(p => p.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ error: "Planet not found" });
  }
  planets[index].name = name;

  console.log(planets);

  res.status(200).json({msg: "Planet was updated"});
});

app.delete("/api/planets/:id", (req, res) => {
  const { id } = req.params;

  const index = planets.findIndex((p) => p.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ error: "Planet not found" });
  }
  planets = planets.filter((p) => p.id !== Number(id));

  console.log(planets);

  res.status(200).json({ msg: "Planet was deleted" });
});

app.listen(port, () =>
  console.log(`Example App Listening on port http://localhost:${port}`)
);
