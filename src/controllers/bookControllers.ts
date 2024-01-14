import express from 'express';
import asyncHandler from 'express-async-handler';

import client from '../database/dbClient';
import { getQuery } from '../helpers/constructUpdateQuery';

export const addBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { isbn, title, author, availableQuantity, shelfLocation } = req.body;

	// check if book already exists
	let query = `SELECT EXISTS(SELECT 1 FROM book WHERE isbn = '${isbn}');`;
	const bookFound = (await client.query(query)).rows[0].exists;
	if (bookFound) {
		res.status(400).json({ error: `Book with ISBN: ${isbn} already exists`});
		return;
	}

	query = `INSERT INTO book(isbn, title, author, available_quantity, shelf_location)\
	VALUES('${isbn}', '${title}', '${author}', ${availableQuantity}, '${shelfLocation}') RETURNING *;`;
	const book = (await client.query(query)).rows[0];
	  
	res.status(201).json({ book });
	return;
});


export const updateBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { bookIsbn } = req.params;
	const updates = req.body;

	// check if the book's ISBN is not correct
	let query = `SELECT EXISTS(SELECT 1 FROM book WHERE isbn = '${bookIsbn}');`;
	const bookFound = (await client.query(query)).rows[0].exists;
	if (!bookFound) {
		res.status(400).json({ error: `No books found with ISBN: ${bookIsbn}`});
		return;
	}

	// construct update query
	query = getQuery('UPDATE book SET', updates) + ` WHERE isbn = '${bookIsbn}' RETURNING *;`;
	const updatedBook = (await client.query(query)).rows[0];

	res.json({ updatedBook });
	return;
});


export const deleteBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { bookIsbn } = req.params;

	// check if the book's ISBN is not correct
	let query = `SELECT EXISTS(SELECT 1 FROM book WHERE isbn = '${bookIsbn}');`;
	const bookFound = (await client.query(query)).rows[0].exists;
	if (!bookFound) {
		res.status(400).json({ error: `No books found with ISBN: ${bookIsbn}`});
		return;
	}
	
	// check if the book is borrowed
	query = `SELECT EXISTS(SELECT 1 FROM borrowing WHERE book_id = '${bookIsbn}');`;
	const bookBorrowed = (await client.query(query)).rows[0].exists;
	if (bookBorrowed) {
		res.status(409).json({ error: 'Can not delete a book data while it is borrowed'});
		return;
	}

	query = `DELETE FROM book WHERE isbn = '${bookIsbn}';`;
	await client.query(query);
	
	res.json(`Book with ISBN: ${bookIsbn} is successfully deleted`);
	return;
});


export const getBooks = asyncHandler(async (req: express.Request, res: express.Response) => {
	const filter = req.query; // title or author or isbn
	let query = 'SELECT * FROM book';

	//check if the user wants to list all books or search for a specific book
	if (Object.keys(filter).length !== 0)
		query += ` WHERE ${Object.keys(filter)[0]} = '${Object.values(filter)[0]}'`;

	const data = (await client.query(query)).rows;
	// check if the book's filter data is not correct
	if (data.length === 0) {
		res.status(400).json({ error: `No books found with ${Object.keys(filter)[0]}: ${Object.values(filter)[0]}`});
		return;
	}

	res.json({ data });
	return;
});
