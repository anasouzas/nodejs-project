const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const path = require("path");
const bcrypt = require("bcryptjs");
const { init: initTemplate } = require("./src/helpers/handlebars");
const { MAIN_DIR } = require("./src/config/constants");

const app = express();

initTemplate(app);

dotenv.config({
    path: "./.env",
});

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
});

app.use(express.static(path.join(__dirname, "./assets")));
app.use(express.urlencoded({ extended: "false" }));
app.use(express.json());

db.connect((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("MySQL connected!");
    }
});

app.get("/", (req, res) => {
    res.render("index", {layout: MAIN_DIR, title: "Home"});
});

app.get("/register", (req, res) => {
    res.render("register", {layout: MAIN_DIR, title: "Register"});
});

app.get("/login", (req, res) => {
    res.render("login", {layout: MAIN_DIR, title: "Login"});
});

app.post("/auth/register", (req, res) => {
    const { name, email, password, password_confirm } = req.body;

    db.query(
        "SELECT email FROM users WHERE email = ?",
        [email],
        async (error, result) => {
            if (error) {
                console.log(error);
            }

            if (result.length > 0) {
                return res.render("register", {layout: MAIN_DIR, title: "Register"}, {
                    message: "This email is already in use.",
                });
            } else if (password !== password_confirm) {
                return res.render("register", {layout: MAIN_DIR, title: "Register"}, {
                    message: "Passwords do not match!",
                });
            }

            let hashedPassword = await bcrypt.hash(password, 8);

            db.query(
                "INSERT INTO users SET ?",
                { name: name, email: email, password: hashedPassword },
                (error, result) => {
                    if (error) {
                        console.log(error);
                    } else {
                        return res.render("register", {layout: MAIN_DIR, title: "Register"}, {
                            message: "User registered!",
                        });
                    }
                }
            );
        }
    );
});

app.listen(5000, () => {
    console.log("Server started on port 5000");
});
