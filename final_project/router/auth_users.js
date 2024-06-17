const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Check if the username is valid
const isValid = (username) => {
  // Check if the username exists in the users array
  return users.some(user => user.username === username);
}

// Check if username and password match the one we have in records
const authenticatedUser = (username, password) => {
  // Check if the username and password match an existing user
  return users.some(user => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, "your_jwt_secret", { expiresIn: '1h' });
  return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username; // Assuming req.user is set by the auth middleware

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  let book = books[isbn];
  let reviewIndex = book.reviews.findIndex(r => r.user === username);

  if (reviewIndex >= 0) {
    book.reviews[reviewIndex].review = review;
  } else {
    book.reviews.push({ user: username, review });
  }

  return res.status(200).json({ message: "Review added/modified successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Assuming req.user is set by the auth middleware

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  let book = books[isbn];
  book.reviews = book.reviews.filter(r => r.user !== username);

  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
