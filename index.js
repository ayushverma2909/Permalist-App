import express from "express";
import bodyParser from "body-parser";
import pg from 'pg';

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "your database",
  password: "Your data base password",
  port: 5432,
});
db.connect();

let items = [];

app.get("/", async (req, res) => {

  const result = await db.query("SELECT * FROM items");
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: result.rows,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  // items.push({ title: item });
  try {
    await db.query("INSERT INTO items  (title) VALUES ($1)", [item]);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
  
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  try{
    await db.query("UPDATE items SET title = ($1) WHERE id = $2 ", [item , id]);
    res.redirect("/");
  } catch (error){
    console.log(error);
  }
});

app.post("/delete", async (req, res) => {
  const userId = req.body.deleteItemId;
  try{
    await db.query("DELETE FROM items WHERE id = $1;", [userId]);
    res.redirect("/");
  } catch(err){
    console.log(err);
  }  
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
