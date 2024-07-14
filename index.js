import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import { ConnectMongoose } from "./config/mongoose.config.js";
import { collection } from "./user.schema.js";
import bcrypt from "bcrypt";
import { name } from "ejs";
import "./auth.js";

dotenv.config();

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.set("view engine", "ejs");
server.set("views", "./views");

server.use(express.static("public"));

server.get("/", (req, res) => {
  res.render("login");
});

server.get("/signup", (req, res) => {
  res.render("signup");
});

server.post("/signup", async (req, res) => {
  const data = {
    name: req.body.username,
    password: req.body.password,
  };
  const existingUser = await collection.findOne({ name: data.name });
  if (existingUser) {
    res.send("User already exist.");
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);
    data.password = hashedPassword;
    const userData = await collection.insertMany(data);
    console.log(userData);
  }
});


server.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.username });
    if (!check) {
      res.send("User name cannot found");
    }
    // Compare the hashed password from the database with the plaintext password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (!isPasswordMatch) {
      res.send("wrong Password");
    } else {
      res.render("home");
    }
  } catch {
    res.send("wrong Details");
  }
});

const isLoggedIn = (req, res, next) => {
  req.user ? next() : res.sendStatus(401);
};

server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

server.use(passport.initialize());
server.use(passport.session());

server.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

server.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })
);

server.get("/auth/google/failure", (req, res) => {
  res.send("something went wrong");
});

server.get("/auth/protected", isLoggedIn, (req, res) => {
  const { displayName } = req.user;
  res.send(`Hello ${displayName}`);
});

server.listen(8080, () => {
  console.log("Server is listening on 8080");
  ConnectMongoose();
});
