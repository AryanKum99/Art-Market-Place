const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Razorpay = require('razorpay');
const AWS = require('aws-sdk');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const mongoSanitize = require('express-mongo-sanitize');
const userRoutes = require('./routes/user');
const passport = require('passport');
const User = require('./models/userModel');
const Community = require('./models/communityModel');
const Product = require("./models/productModel");
const CartItem = require('./models/cartModel');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const flash = require('connect-flash');
const { isLoggedIn, isAuthor } = require('./middleware/middleware');
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });
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
console.log(process.env.RAZORPAY_KEY);
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET
});
app.get('/', (req, res) => {
  res.render('home');
});

app.use('/user', userRoutes);

app.get("/paintings", async (req, res, next) => {
  const prods = await Product.find({ category: "Painting" });
  console.log({ prods });
  res.render("paintings", { prods });
});
app.get('/sell', isLoggedIn, async (req, res) => {
  res.render('sell');
});

app.post('/sell', isLoggedIn, catchAsync(async (req, res) => {
  console.log(req.body);
  const art = new Product(req.body);
  art.listedBy = req.user.username;
  await art.save();
  await User.findOneAndUpdate({ username: req.user.username }, {
    $set: {
      isSeller: true
    }
  });
  console.log('success');
  res.redirect('paintings');
}));

app.get('/buy', isLoggedIn, (req, res) => {
  res.redirect('/paintings');
})

app.get("/sketches", isLoggedIn, catchAsync(async (req, res) => {
  const prods = await Product.find({ category: "Sketches" });
  res.render("sketches", { prods });
}));
app.get("/sculptures", isLoggedIn, catchAsync(async (req, res) => {
  const prods = await Product.find({ category: "Sculpture" });
  res.render("sculptures", { prods });
}));

// app.get('/addToCart', isLoggedIn, catchAsync(async(req,res)=>{
//   const 
// }))


app.get('/cart', isLoggedIn, catchAsync(async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  var productArr = [];
  for (let i = 0; i < user.cart.length; i++) {
    const product = await Product.findOne({ _id: user.cart[i] });
    productArr.push(product);
  }
  console.log(productArr);
  console.log(user);
  console.log({ productArr, user });
  res.render('cart', { productArr, user });
}));

//cart-> productID => find karenge aur ek json me daal denge uske baad json render kar denge

app.post('/cart/add/:id', isLoggedIn, catchAsync(async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: req.user._id });
  const product = await Product.findOne({ _id: id });
  user.cartTotal += product.price;
  user.cart.push(id);
  await user.save();
  req.flash("success", "Added to Cart!!");
  res.redirect('/cart');
}));
//

app.delete('/cart/:id', catchAsync(async (req, res) => {
  const prodId = req.params.id;
  console.log(prodId);
  const prod = await Product.findById(prodId);
  const user = await User.findOne({ _id: req.user._id });
  const index = user.cart.indexOf(prodId);
  if (index > -1) {
    user.cart.splice(index, 1);
  }
  user.cartTotal = user.cartTotal - prod.price;
  await user.save();
  req.flash('success', 'Deleted from Cart Successfully');
  res.redirect('/cart');
}))


app.get("/gallery", catchAsync(async (req, res) => {
  res.render("gallery");
}));


app.get("/artists", catchAsync(async (req, res) => {
  const artists = await User.find({ isSeller: true });
  console.log(artists);
  res.render("artists", { artists });
}));


app.get('/community', isLoggedIn, catchAsync(async (req, res) => {
  const comments = await Community.find({});
  res.render('communityChat/community', { comments });
}));


// app.get('/community/new', (req, res) => {
//   res.render('communityChat/newComm');
// })


app.post('/community', catchAsync(async (req, res) => {
  const comment = new Community(req.body);
  console.log(req.body);
  comment.author = req.user.username;
  await comment.save();
  res.redirect('/community');
}))

app.delete('/:commentId', isAuthor, catchAsync(async (req, res) => {
  const { commentId } = req.params;
  await Community.findByIdAndDelete(commentId);
  req.flash('success', 'Successfully deleted review')
  res.redirect('/community');
}));



app.get('/createOrder', catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  res.render('paymentPage', { user });
}));


app.post('/createOrder', async (req, res) => {
  try {
    const amount = req.body.amount * 100
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: 'akum2302@gmail.com'
    }

    razorpayInstance.orders.create(options,
      (err, order) => {
        if (!err) {
          res.status(200).send({
            success: true,
            msg: 'Order Created',
            order_id: order.id,
            amount: amount,
            key_id: process.env.RAZORPAY_KEY,
            product_name: "Cart Total",
            description: "Cart Total",
            contact: "8567345632",
            name: "Somdatta Pradhan",
            email: "somdatta.vskp@gmail.com"
          });
        }
        else {
          res.status(400).send({ success: false, msg: 'Something went wrong!' });
        }
      }
    );
    const user = await User.findOne({ _id: req.user._id });
    while (user.cart.length > 0) {
      user.cart.pop();
    }
    user.cartTotal = 0;
    await user.save();
    console.log('success');
  } catch (error) {
    console.log(error.message);
  }
});


//login -> sell -> usermodel: isSeller: true -> User.findAll(isSeller:true)
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
});


app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!'
  res.status(statusCode).render('error', { err })
})


module.exports = app;