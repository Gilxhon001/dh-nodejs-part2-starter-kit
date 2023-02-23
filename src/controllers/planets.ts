import { Request, Response } from "express";
import Joi from "joi";
import {db} from "../db.js"

const planetSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
});

const planetUpdateSchema = Joi.object({
  name: Joi.string().required(),
});

// GET /planets
const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets`);
  res.status(200).json(planets);
};

// GET /planets/:id
const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = await db.oneOrNone(
    `SELECT * FROM planets WHERE id=$1;`,
    Number(id)
  );
  if (!planet) {
    return res.status(404).json({ error: "Planet not found" });
  }
  res.status(200).json(planet);
};

// POST /planets
const create = async (req: Request, res: Response) => {
  const { name } = req.body;
  const newPlanet = { name };
  const validateNewPlanet = planetUpdateSchema.validate(newPlanet);

  const { error } = validateNewPlanet;
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  await db.none(`INSERT INTO planets (name) VALUES ($1)`, name);
  res.status(201).json({ msg: "Planet was created" });
  // planets = [...planets, newPlanet];
};

// PUT /planets/:id
const updateById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);

  const { error } = planetUpdateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  res.status(200).json({ msg: "Planet was updated" });
};

// DELETE /planets/:id
const deleteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

  res.status(200).json({ msg: "Planet was deleted" });
};

// POST /planets/:id/image
const createImage = async (req: Request, res: Response) => {
  console.log(req.file);

  const {id} = req.params;
  const fileName = req.file?.path;

  if (fileName) {
    db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName]) ;
    res.status(201).json({msg: "Image Uploaded"})
  }

  res.status(400).json({msg: "Planet Image Failed to Upload"})
}

export { getAll, getOneById, create, updateById, deleteById, createImage };
