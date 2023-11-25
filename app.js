const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/user');
const passport = require('passport');
const User = require('./models/userModel');
const Product = require("./models/productModel");
const LocalStrategy = require('passport-local');
app.engine('ejs', ejsMate);
const session = require('express-session');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const secret = process.env.SECRET || "thisisasecret";
app.use(mongoSanitize());
const sessionConfig = {
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// app.use((req, res, next) => {
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash('success');
//     res.locals.error = req.flash('error');
//     next();
// })

// app.get('/', (req, res) => {
//     res.render('home');
// })

app.use('/user', userRoutes);

module.exports = app;
app.get("/", async (req, res) => {
    const prod = await Product.find({});
    res.render("home", { prod });
  });
  // app.get("/paintings", async (req, res) => {
  //   const selectedCategory = req.query.category;
  
  //   try {
  //     const products = await Product.find({ category: selectedCategory });
  //     console.log(products);
  //     res.json(products);
  //   } catch (error) {
  //     console.error("Error fetching Arts:", error);
  //     res.status(500).json({ error: "An error occurred while fetching Arts" });
  //   }
  // });
  app.get("/paintings", async (req, res) => {
    const prods = await Product.find({ category: "Painting" });
    res.render("paintings", { prods });
  });
  app.get("/sketches", async (req, res) => {
    const prods = await Product.find({ category: "Sketches" });
    res.render("sketches", { prods });
  });
  app.get("/sculptures", async (req, res) => {
    const prods = await Product.find({ category: "Sculpture" });
    res.render("sculptures", { prods });
  });