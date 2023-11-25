// login, signup, logout
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const bodyParser = require("body-parser");
const express = require('express');
const session = require("express-session");
const router = express.Router();
router.get('/register', (req, res) => {
    res.render('user/register');
});
router.post('/register', catchAsync(async (req, res) => {
    try {
        console.log(req.body);
        const { userEmail, username, password } = req.body;
        const user = new User({ userEmail, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/');
        })
    } catch (e) {
        console.log('error', e.message);
        res.redirect('user/register');
    }
}));
router.get('/login', (req, res) => {
    res.render('user/login');
});
// router.post('/login', storeReturnTo,
//     // passport.authenticate logs the user in and clears req.session
//     passport.authenticate('local',
//         { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
//             req.flash('success', 'Welcome back!');
//             // const redirectUrl = res.locals.returnTo || '/appointment'; // update this line to use res.locals.returnTo now
//             // res.redirect(redirectUrl);
//             res.redirect('/');
//         });
// router.get('/logout', (req, res, next) => {
//             req.logout(function (err) {
//                 if (err) {
//                     return next(err);
//                 }
//                 req.flash('success', 'Goodbye!');
//                 res.redirect('/');
//             })
//         });

module.exports = router;
