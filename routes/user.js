// login, signup, logout
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const bodyParser = require("body-parser");
const express = require('express');
const session = require("express-session");
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, storeReturnTo } = require('../middleware/middleware');
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
            req.flash('success', 'Welcome to ArtHub')
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('user/register');
    }
}));


router.get('/login', (req, res) => {
    res.render('user/login');
});


router.post('/login', storeReturnTo,
    passport.authenticate('local',
        { failureFlash: true, failureRedirect: '/user/login' }), (req, res) => {
            req.flash('success', 'Welcome back!');
            const redirectUrl = res.locals.returnTo || '/'; // update this line to use res.locals.returnTo now
            console.log("success")
            res.redirect(redirectUrl);
        });

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            console.log(err);
            return next(err);
        } else {
            console.log('success');
            req.flash('success', 'Goodbye!');
            res.redirect('/');
        }
    })
});

module.exports = router;

/// <!-- <% if(error && error.length) {%> -->