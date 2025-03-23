const express = require("express");
const app = express();
const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const path = require("path");
const port = 8080;
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// Create the connection to database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "student",
  password: "Yashj@9844",
});
let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.username(), // before version 9.1.0, use userName()
    faker.internet.email(),
    faker.internet.password(),
  ];
};

let q = "INSERT INTO user (id,username,email,password) VALUES ?";

let data = [];
for (let i = 1; i <= 100; i++) {
  data.push(getRandomUser());
}

app.listen(port, (req, res) => {
  console.log("listening");
});

app.get("/", (req, res) => {
  let q = `SELECT count(*) FROM user`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("home.ejs", { count });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let users = result;
      res.render("show.ejs", { users });
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  console.log(id);
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    console.log(err);
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { password, username } = req.body;
  console.log(password);
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      if (password != user.password) {
        res.send("Wrong password");
      } else {
        let q = `UPDATE user SET username = '${username}' WHERE id = '${id}'`;

        try {
          connection.query(q, (err, result) => {
            if (err) throw err;
            res.redirect("/user");
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/add", (req, res) => {
  res.render("add.ejs");
});
app.post("/user/add", (req, res) => {
  let { username, password, email } = req.body;
  let id = uuidv4();
  let q = `INSERT INTO user VALUES ('${id}','${username}','${email}','${password}')`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/user/:id/delete",(req,res) =>
{
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs",{user});
    });
  } catch (err) {
    console.log(err);
  }
    
})

app.delete("/user/:id", (req,res)=>
{
      let {username,password} = req.body;
      let {id} = req.params;
      
      let q = `SELECT * FROM user WHERE id = '${id}'`;

      try {
        connection.query(q, (err, result) => {
          if (err) throw err;
          user = result[0];
          if(user.username == username && user.password == password)
          {
            let  q2 = `DELETE FROM user WHERE id = '${id}'`;

            try {
              connection.query(q2, (err, result) => {
                if (err) throw err;
                res.redirect("/user");
              });
            } catch (err) {
              console.log(err);
            } 
          }
          else{
            res.send("Wrong username or password");
          }
        });
      } catch (err) {
        console.log(err);
      }




      // 


});
