const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();

/* AUTH MIDDLEWARE */
function auth(req, res, next) {

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send("Unauthorized");
    }

    jwt.verify(token, "secretkey", (err, user) => {

        if (err) {
            return res.status(403).send("Invalid Token");
        }

        req.user = user;

        next();
    });
}

/* MIDDLEWARE */
app.use(express.json());
app.use(cookieParser());

/* SECURITY HEADERS */
app.use(helmet());

/* CORS */
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
}));

/* RATE LIMITING */
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests"
});

app.use(limiter);

/* HOME ROUTE */
app.get("/", (req, res) => {
    res.send("Secure API Running");
});

/* LOGIN ROUTE */
app.post("/login", (req, res) => {

    const token = jwt.sign(
        { username: "admin" },
        "secretkey",
        { expiresIn: "1h" }
    );

    res.json({ token });

});

/* PROTECTED ROUTE */
app.get("/dashboard", auth, (req, res) => {

    res.send("Protected Dashboard Access Granted");

});

/* START SERVER */
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
