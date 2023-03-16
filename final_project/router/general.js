const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) 
    {
      if (!isValid(users)) 
      {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } 
      else 
      {
        return res.status(404).json({message: "Customer already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register Customer."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) 
{
    return res.send(JSON.stringify({ books }, null, 4));
});
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) { 

    let get_isbn = new Promise((resolve,reject) => {

        const isbn = books[req.params.isbn]
        
        if(isbn)
        {
            resolve("Get ISBN success")
            return res.send(isbn);
        }
        else
        {
            reject("Get ISBN failed")
        }
    })

    get_isbn.then(
        (successMessage) => 
        {
            console.log(successMessage);
        },
        (errorMessage) => 
        {
            console.log(errorMessage);
            return res.status(404).json({message: "Cannot find ISBN"});
        }
    );
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    let get_author = new Promise((resolve,reject) => {

        const author = req.params.author;
        let keys = Object.keys(books);
        let matched = [];
        
        keys.forEach(key => {
            const book = books[key];
            if(book.author === author)
            {
                matched.push(
                {
                    isbn: key,
                    title: book.title,
                    reviews: book.reviews
                });
                resolve("Get Author Successful")
            }
            else
            {
                reject("Invalid Author")
            }
        });
    })

    get_author.then(
        (successMessage) => 
        {
            console.log(successMessage)
            return res.send({booksbyauthor: matched});
        },
        (errorMessage) => 
        {
            console.log(errorMessage)
            return res.status(404).json({errorMessage});
        }
    );
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

    let get_title = new Promise((resolve,reject) => {

        const title = req.params.title;
        let keys = Object.keys(books);
        let matched = [];

        keys.forEach(key => {
            const book = books[key];
            if(book.title === title)
            {
                matched.push(
                {
                    isbn: key,
                    author: book.author,
                    reviews: book.reviews
                });
                resolve("Get Title Successful")
            }
            else
            {
                reject("Invalid Title")
            }
        });

    })

    get_title.then(
        (successMessage) => 
        {
            console.log(successMessage)
            return res.send({booksbytitle: matched});
        },
        (errorMessage) => 
        {
            console.log(errorMessage)
            return res.status(404).json(errorMessage);
        }
    );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if(books[isbn])
    {
        return res.send(books[req.params.isbn].reviews);
    }

    return res.status(404).json({message: "No matches found"});
});

module.exports.general = public_users;
