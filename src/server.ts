import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";

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

app.get("/api/planets", (req, res) =>  res.status(200).json(planets));

app.get("/api/planets/:id", function(req, res) {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  res.status(200).json(planet);
});

app.post("/api/planets", (req, res)=> {
  const {id, name} = req.body ;
  const newPlanet = {id, name} ;
  planets = [...planets, newPlanet] ;

  console.log(planets);

  res.status(201).json({msg: "Planet was created"});

});

app.listen(port, () =>
  console.log(`Example App Listening on port http://localhost:${port}`)
);
