const Community = require('../models/communityModel');
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in!! You can access the gallery meanwhile!");
        console.log('error');
        return res.redirect('/user/login');
    }
    next();
}
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { commentId } = req.params;
    console.log(commentId);
    const comment = await Community.findOne({ _id: commentId });
    if (!comment.author === req.user.username) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/community`);
    }
    next();
}
