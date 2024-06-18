
// task 1 to 4 

const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const SECRET_KEY = 'your_secret_key';
const jwt = require('jsonwebtoken');

// // Task 1: Get the book list available in the shop
// public_users.get('/', function (req, res) {
//   return res.status(200).json(books);
// });

// // Task 2: Get book details based on ISBN
// public_users.get('/isbn/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     return res.status(200).json(book);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

// // Task 3: Get book details based on author
// public_users.get('/author/:author', function (req, res) {
//   const author = req.params.author;
//   const booksByAuthor = [];
//   for (let isbn in books) {
//     if (books[isbn].author === author) {
//       booksByAuthor.push(books[isbn]);
//     }
//   }
//   if (booksByAuthor.length > 0) {
//     return res.status(200).json(booksByAuthor);
//   } else {
//     return res.status(404).json({ message: "Books by this author not found" });
//   }
// });

// // Task 4: Get book details based on title
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title;
//   const booksByTitle = [];
//   for (let isbn in books) {
//     if (books[isbn].title === title) {
//       booksByTitle.push(books[isbn]);
//     }
//   }
//   if (booksByTitle.length > 0) {
//     return res.status(200).json(booksByTitle);
//   } else {
//     return res.status(404).json({ message: "Books with this title not found" });
//   }
// });

// // Task 5: Get book review
// public_users.get('/review/:isbn', function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];
//   if (book) {
//     return res.status(200).json(book.reviews);
//   } else {
//     return res.status(404).json({ message: "Book not found" });
//   }
// });

// // Task 6: Register a new user
// public_users.post("/register", (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: "Username and password are required" });
//   }

//   const userExists = users.some(user => user.username === username);
//   if (userExists) {
//     return res.status(409).json({ message: "Username already exists" });
//   }

//   users.push({ username, password });
//   return res.status(201).json({ message: "User registered successfully" });
// });

// module.exports.general = public_users;



public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  for (const user of users) {
    if (user.username === username) {
      return res.status(400).json({ message: "Username already exists" });
    }
  }
  users.push({ username, password });
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  return res
    .status(200)
    .json({ message: "User successfully registered", token });
});

// Get the book list available in the shop..
public_users.get("/", async (req, res) => {
  const booklist = await books();
  return res.status(200).json(booklist);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
  const book_isbn = await books[req.params.isbn];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
  const name = req.params.author.toLowerCase().trim();
  const authorBooks = [];

  for (const isbn in books) {
    if (
      books[isbn].author &&
      books[isbn].author.toLowerCase().trim() === name
    ) {
      await authorBooks.push(books[isbn]);
    }
  }

  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get all books based on title
public_users.get("/title/:title",async (req, res) => {
  const title = req.params.title.toLowerCase().trim();
  const authorBooks = [];

  for (const isbn in books) {
    if (books[isbn].title && books[isbn].title.toLowerCase().trim() === title) {
      await authorBooks.push(books[isbn]);
    }
  }

  if (authorBooks.length > 0) {
    return res.status(200).json(authorBooks);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
