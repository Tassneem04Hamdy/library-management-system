import express from 'express';
import asyncHandler from 'express-async-handler';

import client from '../database/dbClient';
import { getQuery } from '../helpers/constructUpdateQuery';

export const addBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { isbn, title, author, availableQuantity, shelfLocation } = req.body;

	const query = `INSERT INTO book(isbn, title, author, available_quantity, shelf_location)\
	VALUES('${isbn}', '${title}', '${author}', ${availableQuantity}, '${shelfLocation}') RETURNING *;`;
	const book = (await client.query(query)).rows[0];
	  
	res.status(201).json({ book });
	return;
});


export const updateBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { bookIsbn } = req.params;
	const updates = req.body;

	// construct update query
	const query = getQuery('UPDATE book SET', updates) + ` WHERE isbn = '${bookIsbn}' RETURNING *;`;
	const updatedBook = (await client.query(query)).rows[0];

	res.json({ updatedBook });
	return;
});


export const deleteBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { bookIsbn } = req.params;

	const query = `DELETE FROM book WHERE isbn = '${bookIsbn}';`;
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
