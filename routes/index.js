var express = require("express");
var router = express.Router();
const flash = require('connect-flash');
const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const LogService = require("../helpers/LogService");


/* GET home page. */
router.get("/", function (req, res, next) {
    if (!req.session.isAuthenticated) {
        LogService.log('info', `Non-authenticated user attempted to acces /, redirecting to login.`);
        res.redirect("/login");
        return;
    }
    LogService.log('info', `Authenticated user ${req.session.user.username} accessed /, redirecting to /posts.`);
    res.redirect("/posts");
});

/* Register */
router.get("/register", function (req, res, next) {
    res.render("register", { title: "Posts" });
});

/* Register */
router.post("/register", function (req, res, next) {
    const username = req.body.uname;
    const password = req.body.psw;
    let [registered, user] = UserModel.register(username, password);
    if (registered) {
        LogService.log('info', `User ${user.username} registered successfully.`);
        res.json({ success: true, message: "Registration successful, please login with your new details."});
    } else {
        LogService.log('error', `User ${username} failed to register, username already exists.`);
        res.status(409).json({ error: "Registration error.", message: "Registration Error. Please choose different details." });
    }
});

/* Login */
router.get("/login", function (req, res, next) {
    if (req.query.message) {
        // insecure
        // enc_message = req.query.message;
        // message = '<div>' + decodeURIComponent(enc_message) + '</div>';
        message = req.query.message;
    } else {
        message = "";
    }
    res.render("login", { title: "Posts", message: message });
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

            LogService.log('info', `User ${user.username} logged in successfully.`);
            res.json({ success: true});
        });
  } else {
    LogService.log('error', `User ${username} failed to log in.`);
    req.session.isAuthenticated = false;
    req.session.error = 'Authentication failed, please check your username and password'
    res.status(409).json({ error: "Authentication error.", message: "Authentication failed, please check your username and password."});
  }
});

/* Posts */
router.get("/posts", function (req, res, next) {
    if (!req.session.isAuthenticated) {
        LogService.log('info', `Non-authenticated user attempted to acces /posts, redirecting to login.`);
        res.redirect("/login");
        return;
    }
    LogService.log('info', `Authenticated user ${req.session.user.username} accessed /posts.`);
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
    res.render("posts", {
      title: "Posts",
      posts: posts,
      username: req.session.user.username,
      userIsAdmin: req.session.user.isAdmin,
    });
  });
});

/* Logs */
router.get("/logs", function (req, res, next) {
    if (!req.session.isAuthenticated) {
        LogService.log('info', `Non-authenticated user attempted to acces /logs, redirecting to login.`);
        res.redirect("/login");
        return;
    }
    if (!req.session.user.isAdmin) {
        LogService.log('info', `Authenticated non-admin user ${req.session.user.username} attempted to access /logs, redirecting to /posts.`);
        res.redirect("/posts");
        return;
    }
    LogService.log('info', `Authenticated admin user ${req.session.user.username} accessed /logs.`);
    res.render("logs", {
        title: "Logs",
        logs: LogService.getAllLogs(),
    });
});

/* Logout */
router.get("/logout", function (req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            LogService.log('error', `Error destroying session: ${err}`);
        } else {
            res.sendStatus(200); // Send a success status
        }
    });
});

module.exports = router;
