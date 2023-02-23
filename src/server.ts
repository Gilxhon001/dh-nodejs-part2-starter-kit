import express from "express";
import "express-async-errors";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  getAll,
  getOneById,
  create,
  updateById,
  deleteById,
  createImage,
} from "./controllers/planets.js";

import multer from "multer";

import {logIn} from"./controllers/users.js";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads")
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
}) ;
const upload = multer({storage}) ;

const app = express();

app.use(express.json());
app.use(morgan("dev"));

dotenv.config();
const port = process.env.PORT || 3000;

app.get("/api/planets", getAll);
app.get("/api/planets/:id", getOneById);
app.post("/api/planets", create);
app.put("/api/planets/:id", updateById);
app.delete("/api/planets/:id", deleteById);

app.post("/api/planets/:id/image", upload.single("image"), createImage);

app.post("/api/users/login", logIn);


app.listen(port, () =>
  console.log(`Example App Listening on port http://localhost:${port}`)
);
