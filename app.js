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
const CartItem = require('./models/cartModel');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const { isLoggedIn } = require('./middleware/middleware');
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
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
app.use(flash());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.get('/', (req, res) => {
  res.render('home');
});

app.use('/user', userRoutes);

app.get("/paintings", async (req, res, next) => {
  const prods = await Product.find({ category: "Painting" });
  res.render("paintings", { prods });
});
app.get('/paintings/add', isLoggedIn, (req, res) => {
  console.log(req.user);
  res.render('paintings/addPainting');
})

//req.user gives
//_id: new ObjectId('65623a8093c3b7ce769419b1'),
//username: 'tim',
// userEmail: 'akum23@fj.com',
// bestSellers: [],
// __v: 0

app.post('/paintings/add', isLoggedIn, catchAsync(async (req, res) => {
  console.log(req.body);
  const art = new Product(req.body);
  art.listedBy = req.user.username;
  await art.save();
  console.log('success');
  res.redirect('paintings');
}));
app.get("/sketches", isLoggedIn, catchAsync(async (req, res) => {
  const prods = await Product.find({ category: "Sketches" });
  res.render("sketches", { prods });
}));
app.get("/sculptures", isLoggedIn, catchAsync(async (req, res) => {
  const prods = await Product.find({ category: "Sculpture" });
  res.render("sculptures", { prods });
}));
app.get('/api/cart', isLoggedIn, catchAsync(async (req, res) => {
  const items = await CartItem.find();
  res.render('cart');
}));

app.post('/api/cart', isLoggedIn, catchAsync(async (req, res) => {
  const { product, price } = req.body;
  console.log(req.body);
  const newItem = new CartItem({ product, price });
  await newItem.save();
  res.status(201).json(newItem);
}));
app.get("/gallery", catchAsync(async (req, res) => {
  res.render("gallery");
}));
app.get("/artist", catchAsync(async (req, res) => {
  const artists = await Product.findAll();
  res.render("artists", { listedBy });
}));
//login -> sell -> usermodel: isSeller: true -> User.findAll(isSeller:true)
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})

module.exports = app;