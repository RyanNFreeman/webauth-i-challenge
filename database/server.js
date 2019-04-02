const express = require("express");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);

const db = require("./dbConfig");
const Users = require("./users/users-module.js");
const restrictedRouter = require("./routes/restricted");


const authenticate = require("./Auth/authenticate");

const server = express();

const sessionConfig = {
  name: "Monkey",
  secret: "This is very secret",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false // used over https only
  },
  httpOnly: true, // js and others will not have access
  resave: false,
  saveUninitialized: false, 
  store: new KnexSessionStore({
    knex: db,
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

server.use("/api/restricted", authenticate, restrictedRouter);

server.get("/", (req, res) => {
  res.send("Sanity Check");
});

server.post("/api/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 8);
  user.password = hash;
  Users.add(user)
    .then(saved => {
      req.session.user = saved;
      res.status(201).json(saved);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

server.post("/api/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    });
});

server.get("/api/users", authenticate, (req, res) => {
  Users.find()
    .then(users => {
      res.json(users);
    })
    .catch(err => res.send(err));
});

module.exports = server;
