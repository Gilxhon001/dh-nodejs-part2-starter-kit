import { Request, Response } from "express";
import { db } from "../db.js";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();

const logIn = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await db.one(`SELECT * FROM users WHERE username=$1`, username);

  if (user && user.password === password) {
    const payload = {
        id: user.id,
        username
    };
    const {SECRET = ""} = process.env;
    const token = jwt.sign(payload, SECRET) ;

    console.log(token);


    await db.none(`UPDATE users SET token=$2 WHERE id=$1`, [user.id, token])

    res.status(400).json({id: user.id, username, token});
  }
  res.status(400).json({ msg: "Username or password incorrect" });
};

export { logIn };