import { Request, Response } from "express";
import Joi from "joi";

type Planet = {
  id: number;
  name: string;
};

type Planets = Planet[];

let planets: Planets = [
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

const getAll = (req: Request, res: Response) => res.status(200).json(planets);

const getOneById = (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));
  if (!planet) {
    return res.status(404).json({ error: "Planet not found" });
  }
  res.status(200).json(planet);
};

const create = (req: Request, res: Response) => {
  const { error } = planetSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { id, name } = req.body;
  const newPlanet: Planet = { id, name };
  planets = [...planets, newPlanet];

  res.status(201).json({ msg: "Planet was created" });
};

const updateById = (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = planetUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const { name } = req.body;

  planets = planets.map((planet) => {
    if (planet.id === Number(id)) {
      return {
        ...planet,
        name,
      };
    }
    return planet;
  });

  res.status(200).json({ msg: "Planet was updated" });
};

const deleteById = (req: Request, res: Response) => {
  const { id } = req.params;

  const index = planets.findIndex((p) => p.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ error: "Planet not found" });
  }
  planets = planets.filter((p) => p.id !== Number(id));

  res.status(200).json({ msg: "Planet was deleted" });
};

export { getAll, getOneById, create, updateById, deleteById };
