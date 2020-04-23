const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const MongoClient = require('mongodb').MongoClient;
const jwt = require('jsonwebtoken');
const parser = require("cookie-parser");
const uri = "mongodb+srv://admin:uyhNfogfXz7WINDR@cluster0-ml5ag.gcp.mongodb.net/test?retryWrites=true";
const pass = "pass1234";

const app = express();
const port = 4000;

app.use(express.static(path.join(__dirname, "public/")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(parser());

MongoClient.connect(uri, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    console.log("Database connected!");
    const demo = db.db("demo");
    const user = demo.collection("user");

    app.get("/", function (req, res) {
        if (req.cookies.utoken) {
            const decoded = jwt.decode(req.cookies.utoken, pass);
            console.log(`Logging you as ${decoded.username}`)
            if (decoded) {
                res.redirect("/user")
            }
            else {
                res.sendFile(path.join(__dirname, "public/html/index.html"));
            }
        }
        else {
            res.sendFile(path.join(__dirname, "public/html/index.html"));
        }
    });

    app.get("/userlogin", function (req, res) {
        if (req.cookies.utoken) {
            const decoded = jwt.decode(req.cookies.utoken, pass);
            console.log(`Logging you as ${decoded.username}`)
            if (decoded) {
                res.redirect("/user")
            }
            else {
                res.sendFile(path.join(__dirname, "public/html/userlogin.html"));
            }
        }
        else {
            res.sendFile(path.join(__dirname, "public/html/userlogin.html"));
        }
    });

    app.get("/usersignup", function (req, res) {
        if (req.cookies.utoken) {
            const decoded = jwt.decode(req.cookies.utoken, pass);
            console.log(`Logging you as ${decoded.username}`)
            if (decoded) {
                res.redirect("/user")
            }
            else {
                res.sendFile(path.join(__dirname, "public/html/usersignup.html"));
            }
        }
        else {
            res.sendFile(path.join(__dirname, "public/html/usersignup.html"));
        }
    });

    app.get("/user", function (req, res) {
        if (req.cookies.utoken) {
            const decoded = jwt.decode(req.cookies.utoken, pass);
            console.log(`Logging you as ${decoded.username}`)
            if (decoded) {
                res.sendFile(path.join(__dirname, "public/html/user.html"));
            }
            else {
                res.redirect("/userlogin");
            }
        }
        else {
            res.redirect("/userlogin");
        }
    });

    app.get("/test", function (re, res) {
        res.sendFile(path.join(__dirname, "public/html/test.html"));
    });

    app.get("/clear", function (req, res) {
        res.clearCookie("utoken");
        res.redirect("/");
    });

    app.post("/userlogin", function (req, res) {
        user.findOne({ username: req.body.username, password: req.body.password }, function (err, doc) {
            if (doc) {
                console.log("Logging you in");
                const token = jwt.sign({ username: req.body.username }, pass);
                res.cookie("utoken", token);
                res.redirect("/user");
            }
            else {
                res.redirect("/usersignup");
            }
        });
    });

    app.post("/usersignup", function (req, res) {
        user.insertOne({ username: req.body.username, password: req.body.password }, function (err, doc) {
            console.log("Logging you in");
            const token = jwt.sign({ username: req.body.username }, pass);
            res.cookie("utoken", token);
            res.redirect("/user");
        });
    });

    app.listen(process.env.PORT || port);

    console.log(`Server Running on http://127.0.0.1:${port}`);
});