"use strict";

require(`dotenv`).config();
const express = require(`express`);

const { sequelize } = require(`./db`);

const { session } = require(`./middlewares/session`);
const { auth, admin } = require("./middlewares/auth");
const { authPage, adminPage } = require("./middlewares/pages");
const { error404, error } = require("./middlewares/fallbacks");

const { login, logout } = require("./paths/auth");
const { listUsers, getUser, createUser, updateUser, deleteUser, loadMoney } = require("./paths/users");
const { listBets, getBet, createBet, updateBet, deleteBet, closeBet, doBet } = require("./paths/bets");
const { loginPage, indexPage, userPage, userCreatePage, usersPage, betPage, betCreatePage, betsPage, errorPage } = require("./paths/pages");


// Server application data
const app = express();
const port = parseInt(process.env.PORT) || 3000;
const hostname = process.env.HOST || `localhost`;


// Middlewares
app.use(express.json());
app.use(session);

// View engine
app.set(`view engine`, `ejs`);


// API

// Authentication paths
app.post(`/login`, login);
app.post(`/logout`, logout);

// Users paths
app.get(`/user`, auth, admin, listUsers);
app.get(`/user/:id`, auth, admin, getUser);
app.post(`/user`, auth, admin, createUser);
app.put(`/user/:id`, auth, admin, updateUser);
app.delete(`/user/:id`, auth, admin, deleteUser);
app.put(`/user/:id/load`, auth, admin, loadMoney);

// Bets paths
app.get(`/bet`, auth, listBets);
app.get(`/bet/:id`, auth, getBet);
app.post(`/bet`, auth, createBet);
app.put(`/bet/:id`, auth, updateBet);
app.delete(`/bet/:id`, auth, deleteBet);
app.put(`/bet/:id/do`, auth, doBet);
app.put(`/bet/:id/close`, auth, admin, closeBet);


// Pages

// Index
app.get(`/`, authPage, indexPage);

// Authentication path
app.get(`/login`, loginPage);

// Users paths
app.get(`/users`, authPage, adminPage, usersPage);
app.get(`/users/create`, authPage, adminPage, userCreatePage);
app.get(`/users/:id`, authPage, adminPage, userPage);

// Bets paths
app.get(`/bets`, authPage, betsPage);
app.get(`/bets/create`, authPage, adminPage, betCreatePage);
app.get(`/bets/:id`, authPage, betPage);

// Errors path
app.get(`/error`, errorPage);


// Fallbacks
app.use(error404);
app.use(error);


// Synchronize database
sequelize.sync();

// Start server
app.listen(port, hostname, () => {
  console.log(`Application running at http://${hostname}:${port}`);
});
