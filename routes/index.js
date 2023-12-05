var express = require("express");
var router = express.Router();
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");


/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Posts" });
});

/* Login */
router.get("/login", function (req, res, next) {
    res.render("login", { title: "Posts" });
});

/* Login */
router.post("/login", function (req, res, next) {
    const username = req.body.uname;
    const password = req.body.psw;
    let [authenticated, user] = UserModel.authenticate(username, password);
    if (authenticated) {
        req.session.regenerate(function () {
            req.session.isAuthenticated = true;
            req.session.user = user;
            req.session.success = "Authenticated as " + user.username + " You may now access posts";
            console.log(req.session);   
            res.redirect("/posts");
        });
  } else {
    console.log("Authentication failed");
    req.session.isAuthenticated = false;
    req.session.error = 'Authentication failed, please check your username and password'
    res.render("login", { title: "Posts" });
  }
});

/* Posts */
router.get("/posts", function (req, res, next) {
    if (!req.session.isAuthenticated) {
        console.log('not authenticated, redirecting to login');
        res.redirect("/login");
        return;
    }
    console.log('isAuthenticated: ' + req.session.isAuthenticated);
    // change the date format to something more readable
    PostModel.getAllPosts().then((posts) => {
        posts.forEach(function (post) {
            var date = new Date(post.time_posted);
            post.time_posted = date.toLocaleString("en-IE", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
    });
    console.log(req.session);
    res.render("posts", {
      title: "Posts",
      posts: posts,
      username: req.session.user.username,
      userIsAdmin: req.session.user.isAdmin,
    });
  });
});

/* Logout */
router.get("/logout", function (req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.log('Error:', err);
        } else {
            res.sendStatus(200); // Send a success status
        }
    });
});

module.exports = router;
