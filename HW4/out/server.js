import express from "express";
import * as url from "url";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import * as argon2 from "argon2";
import { z } from "zod";
import sqlite3 from "sqlite3";
import * as sqlite from "sqlite";
import path from "path";
import cors from "cors";
import csrf from "csurf";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
var csrfProtect = csrf({ cookie: true });
let app = express();
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};
app.use(cors(corsOptions));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(helmet.contentSecurityPolicy());
app.use(express.static("public"));
app.use(limiter);
let __dirname = path.dirname(url.fileURLToPath(import.meta.url));
// create database "connection"
let dbfile = path.resolve(__dirname, "..", "database.db");
let db = await sqlite.open({
    filename: dbfile,
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");
let loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});
function makeToken() {
    return crypto.randomBytes(32).toString("hex");
}
let tokenStorage = {};
let cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
};
async function AddAccount(req, res) {
    let parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ message: "Username or password invalid" });
    }
    let { username, password } = parseResult.data;
    const hashpassword = argon2.hash(password);
    const sql = "INSERT INTO users (username, password, role) VALUES (? ,? ,? )";
    db.run(sql, username, hashpassword, "admin");
    res.send({ "message": "success add acount" });
}
async function login(req, res) {
    let parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ message: "Username or password invalid" });
    }
    let { username, password } = parseResult.data;
    console.log(username, password);
    let user = await db.get("SELECT * FROM users WHERE username = ?", [
        username,
    ]);
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    console.log("find user " + username + "password" + password);
    console.log(user.password);
    let passwordverify = await argon2.verify(user.password, password);
    if (!passwordverify) {
        return res.status(401).json({ message: "Incorrect password" });
    }
    let token = makeToken();
    tokenStorage[token] = { username };
    res.cookie("token", token, cookieOptions);
    return res.json({ message: "Login Success" });
}
async function logout(req, res) {
    let { token } = req.cookies;
    console.log(token);
    if (token === undefined) {
        return res.send().status(401);
    }
    if (!tokenStorage.hasOwnProperty(token)) {
        return res.send().status(401);
    }
    delete tokenStorage[token];
    return res.clearCookie("token", cookieOptions).send();
}
let authorize = (req, res, next) => {
    console.log("start authorization");
    let { token } = req.cookies;
    if (token === undefined) {
        return res.send("token undefined").status(401);
    }
    if (!tokenStorage.hasOwnProperty(token)) {
        console.log("token not found ");
        return res.send().status(401);
    }
    next();
};
app.post("addAccount", (res) => {
    const { account, password } = res.body;
});
app.post("/login", login);
app.post("/AddAccount", AddAccount);
app.post("/logout", logout);
//app.get("/private", authorize, privateAPI);
// select examples
let authors = await db.all("SELECT * FROM authors");
console.log("Authors", authors);
let books = await db.all("SELECT * FROM books");
console.log("Books", books);
let filteredBooks = await db.all("SELECT * FROM books WHERE pub_year = '1867'");
console.log("Some books", filteredBooks);
//
// EXPRESS EXAMPLES
//
// GET/POST/DELETE example
class Data {
    constructor(message, id) {
        this.id = id;
        this.message = message;
    }
}
// res's type limits what reonses this request handler can send
// it must send either an object with a message or an error
app.get("/foo", (req, res) => {
    if (!req.query.bar) {
        return res.status(400).json({ error: "bar is required" });
    }
    return res.json({ message: `You sent: ${req.query.bar} in the query` });
});
app.post("/foo", (req, res) => {
    if (!req.body.bar) {
        return res.status(400).json({ error: "bar is required" });
    }
    return res.json({ message: `You sent: ${req.body.bar} in the body` });
});
app.delete("/foo", (req, res) => {
    // etc.
    res.sendStatus(200);
});
//
// ASYNC/AWAIT EXAMPLE
//
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// need async keyword on request handler to use await inside it
app.get("/bar", csrfProtect, async (req, res) => {
    console.log("Waiting...");
    // await is equivalent to calling sleep.then(() => { ... })
    // and putting all the code after this in that func body ^
    await sleep(3000);
    // if we omitted the await, all of this code would execute
    // immediately without waiting for the sleep to finish
    console.log("Done!");
    return res.sendStatus(200);
});
// test it out! while server is running:
// curl http://localhost:3000/bar
// there is my self code server book and author
//get books list
/***
 * get books list "http://localhost:3000/books"
 * get authors list "http://localhost:3000/authors"
 * insert book "http://localhost:3000/book"
 * insert author "http://localhost:3000/author"
 * delete book "http://localhost:3000/book"
 * delete author "http://localhost:3000/author"
 * update book "http://localhost:3000/updatedBook
 * update author "http://localhost:3000/updatedAuthor"
 *
 *
 *
 *
 */
app.get("/books", csrfProtect, async (req, res) => {
    let books = await db.all("SELECT * FROM books ");
    res.send(books);
});
// get author list
app.get("/authors", csrfProtect, async (req, res) => {
    let authors = await db.all("SELECT * FROM authors");
    res.send(authors);
});
//get use book id query book info 
app.get("/book", csrfProtect, async (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ error: "id is required" });
    }
    let book = await db.all("SELECT * FROM books WHERE id =  ? ", req.query.id);
    res.send(book);
});
app.get("/genrebook", csrfProtect, async (req, res) => {
    if (!req.query.genre) {
        return res.status(400).json({ error: "genre is required" });
    }
    let book = await db.all("SELECT * FROM books WHERE genre =  ? ", req.query.genre);
    res.send(book);
});
app.get("/author", csrfProtect, async (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ error: "id is required" });
    }
    let author = await db.all("SELECT * FROM authors WHERE id =  ? ", req.body.id);
    res.send(author);
});
// insert book data 
app.post("/book", authorize, csrfProtect, async (req, res) => {
    const sql = "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?,?,?,?,?)";
    const { id, author_id, title, pub_year, genre } = req.body;
    if (!id && !author_id && !title && !pub_year && !genre) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag = false;
    let flagid = false;
    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
    for (let i = 0; i < authors.length; i++) {
        if (author_id == authors[i].id) {
            flag = true;
        }
    }
    console.log("id = >" + id);
    for (let i = 0; i < books.length; i++) {
        console.log(books[i]["id"]);
        if (id == books[i]["id"]) {
            flagid = true;
        }
    }
    if (flag && !flagid) {
        db.run(sql, id, author_id, title, pub_year, genre);
        const data = new Data("insert id", id);
        res.send(data);
    }
    if (!flag) {
        res.status(400).send({ "error": "the author id not exist" });
        return 0;
    }
    if (flagid) {
        res.status(400).send({ "error": "the book id is exist" });
    }
});
// insert author data
app.post("/author", authorize, csrfProtect, async (req, res) => {
    let authors = await db.all("SELECT * FROM authors");
    const sql = "INSERT INTO authors(id, name, bio) VALUES(?,?,?)";
    const { id, name, bio } = req.body;
    if (!id && !name && !bio) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag = false;
    for (let i = 0; i < authors.length; i++) {
        if (id == authors[i].id) {
            flag = true;
        }
    }
    if (flag) {
        res.status(400).send({ "error": "the author id is exist" });
    }
    if (!flag) {
        db.run(sql, id, name, bio);
        res.sendStatus(200);
    }
});
app.post("/updateBook", authorize, csrfProtect, async (req, res) => {
    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
    const sql = "UPDATE books set  author_id = ? , title = ? , pub_year = ? , genre = ? where id = ? ";
    const { id, author_id, title, pub_year, genre } = req.body;
    if (!id && !author_id && !title && !pub_year && !genre) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag = false;
    let flagid = false;
    for (let i = 0; i < authors.length; i++) {
        if (author_id == authors[i].id) {
            flag = true;
        }
    }
    for (let i = 0; i < books.length; i++) {
        if (id == books[i].id) {
            flagid = true;
        }
    }
    if (flag && flagid) {
        db.run(sql, author_id, title, pub_year, genre, id);
        res.sendStatus(200);
        return;
    }
    if (!flag) {
        res.status(400).send({ "error": "the author id not exist" });
        return;
    }
    if (!flagid) {
        res.status(400).send({ "error": "the book id not exist" });
        return;
    }
});
// update author data
app.post("/updateAuthor", csrfProtect, async (req, res) => {
    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
    const sql = "UPDATE authors set name = ? , bio = ? where id = ?";
    const { id, name, bio } = req.body;
    if (!id && !name && !bio) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag = false;
    for (let i = 0; i < authors.length; i++) {
        if (id == authors[i].id) {
            flag = true;
        }
    }
    if (flag) {
        db.run(sql, name, bio, id);
        res.sendStatus(200);
        return;
    }
    else {
        res.status(400).send({ "error": "the author id not exist" });
        return;
    }
});
app.delete("/book/", authorize, csrfProtect, async (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ error: "delete id is required" });
    }
    let books = await db.all("SELECT * FROM books");
    const sql = "DELETE FROM books WHERE id = ? ";
    let flag = false;
    for (let i = 0; i < books.length; i++) {
        if (books[i].id == req.query.id) {
            flag = true;
        }
    }
    if (flag) {
        db.run(sql, req.query.id);
        res.sendStatus(200);
    }
    else {
        res.status(400).send({ "error": "the book id not exist" });
    }
});
app.delete("/author", csrfProtect, async (req, res) => {
    if (!req.query.id) {
        return res.status(400).json({ error: "delete id is required" });
    }
    let authors = await db.all("SELECT * FROM authors");
    let flag = false;
    for (let i = 0; i < authors.length; i++) {
        if (req.query.id == authors[i].id) {
            flag = true;
        }
    }
    if (flag) {
        const sql = "DELETE FROM authors WHERE id = ?";
        db.run(sql, req.query.id);
        res.sendStatus(200);
    }
    else {
        res.status(400).send({ "error": "the delete id not exist" });
    }
});
app.get("*", function (req, res) {
    res.status(404).send({ "error": "url not found" });
});
app.put("/updateBook", authorize, csrfProtect, async (req, res) => {
    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
    const sql = "UPDATE books set  author_id = ? , title = ? , pub_year = ? , genre = ? where id = ? ";
    const { id, author_id, title, pub_year, genre } = req.body;
    if (!id && !author_id && !title && !pub_year && !genre) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag = false;
    let flagid = false;
    for (let i = 0; i < authors.length; i++) {
        if (author_id == authors[i].id) {
            flag = true;
        }
    }
    for (let i = 0; i < books.length; i++) {
        if (id == books[i].id) {
            flagid = true;
        }
    }
    if (flag && flagid) {
        db.run(sql, author_id, title, pub_year, genre, id);
        res.sendStatus(200);
        return;
    }
    if (!flag) {
        res.status(400).send({ "error": "the author id not exist" });
        return;
    }
    if (!flagid) {
        res.status(400).send({ "error": "the book id not exist" });
        return;
    }
});
// run server
let port = 3000;
//let host = "localhost";
let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});
