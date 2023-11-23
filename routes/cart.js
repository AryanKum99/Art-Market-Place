const CartItem = require('../models/cartModel');
const bodyParser = require("body-parser");
const session = require("express-session");

router.get('/showCart', (req, res) =>{
    res.render('cart');
});
router.get('/buyItems', isLoggedIn, async (req, res) =>{
    res.render('payment');
});
router.post('/buyItems/payment', isLoggedIn, async (req, res) =>{
    
});
router.post('/addQty', isLoggedIn, async (req, res) =>{
});
