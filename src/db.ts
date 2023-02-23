import pgPromise from "pg-promise";

//Database Connection
const db = pgPromise()("postgres://postgres:1234@localhost:5432/video");

//Database SetUp
const setupDb = async () => {
  //Creating a new Table
  await db.none(`
  DROP TABLE IF EXISTS planets;
  CREATE TABLE planets(
    id SERIAL NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT
  );

  DROP TABLE IF EXISTS users;
  CREATE TABLE users(
    id SERIAL NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    token TEXT
  );

  `);

  //Inserting some planets
  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
  await db.none(`INSERT INTO users (username, password) VALUES ('test', 'test')`);

  const planets = await db.many(`SELECT * FROM planets;`);
  console.log(planets);
};

setupDb();


export {db}
