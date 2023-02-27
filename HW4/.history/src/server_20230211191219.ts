import express, {
    Request,
    Response,
    RequestHandler,
    CookieOptions,
} from "express";
import * as url from "url";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import cors from "cors";
let app = express();
app.use(express.json());
app.use(cors())
app.use(express.static("public"))


// create database "connection"
let db = await open({
    filename: "../database.db",
    driver: sqlite3.Database,
});
await db.get("PRAGMA foreign_keys = ON");


// SQLITE EXAMPLES
// comment these out or they'll keep inserting every time you run your server
// if you get 'UNIQUE constraint failed' errors it's because
// this will keep inserting a row with the same primary key
// but the primary key should be unique


// insert example
await db.run(
    "INSERT INTO authors(id, name, bio) VALUES('1', 'Figginsworth III', 'A traveling gentleman.')"
);
await db.run(
    "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES ('1', '1', 'My Fairest Lady', '1866', 'romance')"
);

// insert example with parameterized queries
// important to use parameterized queries to prevent SQL injection
// when inserting untrusted data
let statement = await db.prepare(
    "INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?, ?, ?, ?, ?)"
);
await statement.bind(["2", "1", "A Travelogue of Tales", "1867", "adventure"]);
await statement.run();

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
class Data{
   message: string
  id:number
  constructor(message:string,id :number){
    this.id= id
    this.message=message
  }
}
interface Foo {
    message: string;
}
interface Error {
    error: string;
}
interface Book{
    message: string;
}
interface Author{
  message : string;
}
type FooResponse = Response<Foo | Error>;
type BookResponse = Response<Book|Error>;
type AuthorResponse = Response<Author|Error>
// res's type limits what responses this request handler can send
// it must send either an object with a message or an error
app.get("/foo", (req, res: FooResponse) => {
    if (!req.query.bar) {
        return res.status(400).json({ error: "bar is required" });
    }
    return res.json({ message: `You sent: ${req.query.bar} in the query` });
});
app.post("/foo", (req, res: FooResponse) => {
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

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// need async keyword on request handler to use await inside it
app.get("/bar", async (req, res: FooResponse) => {
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
app.get("/books",async (req,res:BookResponse)=>{
let books :Book= await db.all("SELECT * FROM books ");
  res.send(books)
});
// get author list
app.get("/authors",async (req,res:AuthorResponse)=>{
 let authors : Author = await db.all("SELECT * FROM authors")
  res.send(authors)
})
//get use book id query book info 
app.get("/book", async (req,res:BookResponse)=>{
    if (!req.query.id) {
        return res.status(400).json({ error: "id is required" });
    }
let book :Book= await db.all("SELECT * FROM books WHERE id =  ? ",req.query.id);
  res.send(book)
})

app.get("/genrebook", async (req,res:BookResponse)=>{
    if (!req.query.genre) {
        return res.status(400).json({ error: "genre is required" });
    }
let book :Book= await db.all("SELECT * FROM books WHERE genre =  ? ",req.query.genre);
  res.send(book)
})
app.get("/author", async (req,res:AuthorResponse)=>{
    if (!req.query.id) {
        return res.status(400).json({ error: "id is required" });
    }
let  author:Author= await db.all("SELECT * FROM authors WHERE id =  ? ",req.body.id)
  res.send(author)
})
// insert book data 
app.post("/book",async (req, res:BookResponse )=>{
    const sql ="INSERT INTO books(id, author_id, title, pub_year, genre) VALUES (?,?,?,?,?)";
    const {id,author_id,title,pub_year,genre}=req.body 

    if (!id&&!author_id&&!title&&!pub_year&&!genre) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag :boolean=false
    let flagid:boolean=false
    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
    for (let i = 0; i < authors.length; i++) {
        if (author_id==authors[i].id){
            flag=true
        }
    }
        console.log("id = >"+ id)
    for (let i = 0; i < books.length; i++) {
        console.log(books[i]["id"])
        if(id==books[i]["id"]){
            flagid=true
        }
    }
    if (flag && !flagid){
    db.run(sql,id,author_id,title,pub_year,genre)
        const data =new  Data("insert id",id)
        res.send(data)
    }
    if(!flag){
        res.status(400).send({"error":"the author id not exist"})
        return 0;
    }
    if (flagid){
        res.status(400).send({"error":"the book id is exist"})
    }
})
// insert author data
app.post("/author", async (req,res:AuthorResponse )=>{
    let authors = await db.all("SELECT * FROM authors");
  const sql = "INSERT INTO authors(id, name, bio) VALUES(?,?,?)"
  const {id,name,bio}=req.body
    if (!id&&!name&&!bio) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag :boolean=false
    for (let i = 0; i < authors.length; i++) {
        if (id==authors[i].id){
            flag=true
        }
    }
    if(flag){
        
        res.status(400).send({"error":"the author id is exist"})
    }
    if (!flag){
        db.run(sql,id,name,bio)
        res.sendStatus(200)
    }
})
app.post("/updateBook",async (req, res:BookResponse)=>{
    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
    const sql = "UPDATE books set  author_id = ? , title = ? , pub_year = ? , genre = ? where id = ? "
    const {id,author_id,title,pub_year,genre}=req.body
    if (!id&&!author_id&&!title&&!pub_year&&!genre) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag :boolean=false
    let flagid:boolean=false
    for (let i = 0; i < authors.length; i++) {
        if (author_id==authors[i].id){
            flag=true
        }
    }
    for (let i = 0; i < books.length; i++) {
        if(id==books[i].id){
            flagid=true
        }
    }
    if (flag && flagid){
        db.run(sql,author_id,title,pub_year,genre,id)
        res.sendStatus(200)
        return

    }
    if (!flag){

        res.status(400).send({"error":"the author id not exist"})
        return 
    }

    if (!flagid){
        res.status(400).send({"error":"the book id not exist"})
        return
    }
})
// update author data
app.post("/updateAuthor", async (req, res:AuthorResponse )=>{

    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
  const sql = "UPDATE authors set name = ? , bio = ? where id = ?";
  const {id,name,bio}=req.body
    if (!id&&!name&&!bio) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag :boolean=false
    for (let i = 0; i < authors.length; i++) {
        if (id==authors[i].id){
            flag=true
        }
    }
    if (flag){
        db.run (sql,name,bio,id)
        res.sendStatus(200)
        return
    }
    else {
        res.status(400).send({"error":"the author id not exist"})
        return
    }
})

app.delete("/book/", async (req,res:BookResponse)=>{
    if (!req.query.id) {
        return res.status(400).json({ error: "delete id is required" });
    }
    let books = await db.all("SELECT * FROM books");
  const sql = "DELETE FROM books WHERE id = ? "
    let flag:boolean=false
    for (let i = 0; i < books.length; i++) {
        if (books[i].id==req.query.id){
            flag=true
        }
    }
    if (flag){
        db.run(sql,req.query.id)
        res.sendStatus(200)
    }
    else {
        res.status(400).send({"error":"the book id not exist"})
    }
})

app.delete("/author", async (req,res:AuthorResponse)=>{
    if (!req.query.id) {
        return res.status(400).json({ error: "delete id is required" });
    }
    let authors = await db.all("SELECT * FROM authors");
    let flag :boolean=false
    for (let i = 0; i < authors.length; i++) {
        if (req.query.id==authors[i].id){
            flag=true
        }
    }
    if (flag){
        const sql = "DELETE FROM authors WHERE id = ?";
        db.run(sql,req.query.id)
        res.sendStatus(200)
    }
    else {
        res.status(400).send({"error":"the delete id not exist"})
    }

})

app.get("*",function(req,res){
    res.status(404).send({"error":"url not found"})
})

app.put("/updateBook",async (req, res:BookResponse)=>{
    let books = await db.all("SELECT * FROM books");
    let authors = await db.all("SELECT * FROM authors");
    const sql = "UPDATE books set  author_id = ? , title = ? , pub_year = ? , genre = ? where id = ? "
    const {id,author_id,title,pub_year,genre}=req.body
    if (!id&&!author_id&&!title&&!pub_year&&!genre) {
        return res.status(400).json({ error: "body data is required" });
    }
    let flag :boolean=false
    let flagid:boolean=false
    for (let i = 0; i < authors.length; i++) {
        if (author_id==authors[i].id){
            flag=true
        }
    }
    for (let i = 0; i < books.length; i++) {
        if(id==books[i].id){
            flagid=true
        }
    }
    if (flag && flagid){
        db.run(sql,author_id,title,pub_year,genre,id)
        res.sendStatus(200)
        return

    }
    if (!flag){

        res.status(400).send({"error":"the author id not exist"})
        return 
    }

    if (!flagid){
        res.status(400).send({"error":"the book id not exist"})
        return
    }
})

let loginSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1),
});

function makeToken() {
    return crypto.randomBytes(32).toString("hex");
}

// e.g. { "z7fsga": { username: "mycoolusername" } }
let tokenStorage: { [key: string]: { username: string } } = {};

// need to use same options when creating and deleting cookie
// or cookie won't be deleted
let cookieOptions: CookieOptions = {
    httpOnly: true, // JS can't access it
    secure: true, // only sent over HTTPS connections
    sameSite: "strict", // only sent to this domain
};

async function login(req: Request, res: Response<MessageResponse>) {
    let parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
        return res
            .status(400)
            .json({ message: "Username or password invalid" });
    }
    let { username, password } = parseResult.data;
    console.log(username, password)

    // TODO log user in if credentials valid
    // use argon2 to hash the password
    // https://github.com/ranisalt/node-argon2
    // https://expressjs.com/en/api.html#res.cookie
    // TIP make sure to pass cookieOptions when creating cookie
    let user = await db.get("SELECT * FROM users WHERE username = ?", [
        username,
    ]);
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }
    console.log("find user "+username+"password"+password)

    let passwordverify = await argon2.verify(user.password, password);
    if (!passwordverify) {
        return res.status(401).json({ message: "Incorrect password" });
    }
     let token = makeToken();
    tokenStorage[token] = { username };
    res.cookie("token", token, cookieOptions);
    return res.json({ message: "Login Success" });
}

async function logout(req: Request, res: Response<EmptyResponse>) {
    let { token } = req.cookies;
    console.log(token)
    if (token === undefined) {
        // already logged out
        return res.send().status(401);
    }
    if (!tokenStorage.hasOwnProperty(token)) {
        // token invalid
        return res.send().status(401);
    }
    delete tokenStorage[token];
    return res.clearCookie("token", cookieOptions).send();
}

let authorize: RequestHandler = (req, res, next) => {
    // TODO only allow access if user logged in
    // by sending error response if they're not
    console.log("start authorization")
    let { token } = req.cookies;
      if (token === undefined) {
        // already logged out
        return res.send().status(401);
    }
    if (!tokenStorage.hasOwnProperty(token)) {
        // token invalid
    console.log("token not found ")
        return res.send().status(401);
    }
    next();
};

function publicAPI(req: Request, res: Response<MessageResponse>) {
    return res.json({ message: "A public message" });
}
function privateAPI(req: Request, res: Response<MessageResponse>) {
    return res.json({ message: "A private message" });
}
app.post("addAccount",(res:Request) => {
    const {account,password} =res.body
})

app.post("/login", login);
app.post("/logout", logout);
app.get("/public", publicAPI);
app.get("/private", authorize, privateAPI);

// https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
// only do this when deploying in "production" mode
// because ts-watch will delete built react assets during dev mode
// and we'll get annoying console errors about public not existing
if (process.env.PROD === "1") {
    app.use(express.static(path.join(__dirname, "public")));
    app.get("/*", function (req, res) {
        res.sendFile(path.join(__dirname, "public", "index.html"));
    });
}


// run server
let port = 3000;
 //let host = "localhost";
  let host = "localhost";
let protocol = "http";
app.listen(port, host, () => {
    console.log(`${protocol}://${host}:${port}`);
});

