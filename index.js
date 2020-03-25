const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 5000;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwtSecret = "KEEPSLIP_SECRET";
const cookie = require("cookie-parser");

app.use(cookie());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/signup", async (req, res) => {
  let password = await bcrypt.hash(req.body.password, saltRounds);
  //   connect with database and record data
  res.send(password);
});

app.post("/login", async (req, res) => {
  let hashed = "$2b$10$g0ARM2p2cuff1tmoN6qNeeERCCM3qylTU1oDVCcpVoEB3AFZp7wAa";
  let user = await bcrypt.compare(req.body.password, hashed);
  //   res.send(user);
  if (user) {
    var token = jwt.sign({ name: req.body.name }, jwtSecret, {
      expiresIn: "15s"
    });
    res.cookie("token", token).send("cookie set");
  } else {
    res.send("Wrong password!");
  }
});

app.get("/", jwtVerify, async (req, res) => {
  // Cookies that have not been signed
  console.log("Cookies: ", req.cookies);
  // Cookies that have been signed
  console.log("Signed Cookies: ", req.signedCookies);
  //   res.send(req.user);
  if (req.user) {
    res.send("hi!");
  }
  //   jwt.verify(req.cookies.token, jwtSecret, (error, result) => {
  //     if (!error) {
  //       console.log(result);
  //       res.send(result);
  //     } else {
  //       console.log(error);
  //       res.send(error);
  //     }
  //   });
});

app.delete("/logout", (req, res) => {
  res.clearCookie("token").send("Token cookie cleared!");
});

app.listen(port, () => {
  console.log(`Auth app is listening on port ${port}`);
});

function jwtVerify(req, res, next) {
  jwt.verify(req.cookies.token, jwtSecret, (error, result) => {
    if (!error) {
      console.log(result);
      req.user = result;
      next();
    } else {
      console.log(error);
      //   res.send(error);
      res.status(401).send("Unauthorization!");
    }
  });
}

// Encrypt and decrypt Password
// let myPlaintextPassword = "1234";
// let wrongPassword = "12345";
// bcrypt.hash(myPlaintextPassword, saltRounds, function(err, hash) {
//   console.log(hash);
// });

// let hash = "$2b$10$WHSBVNWWb6t6JZB92eftqemoOFtYbYkCcCLvVxPep.R5qeUSfTrKe";
// bcrypt.compare(wrongPassword, hash, function(err, result) {
//   console.log(result);
// });

// // JWT
// var token = jwt.sign({ name: "aof" }, jwtSecret, { expiresIn: "1h" });
// console.log(token);

// var decoded = jwt.verify(token, jwtSecret);
// console.log(decoded);
