import express from 'express';
import asyncHandler from 'express-async-handler';

import client from '../database/dbClient';
import { getQuery } from '../helpers/constructUpdateQuery';

export const addBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { isbn, title, author, availableQuantity, shelfLocation } = req.body;

	const query = `INSERT INTO book(isbn, title, author, available_quantity, library_id, shelf_location)\
					VALUES('${isbn}', '${title}', '${author}', ${availableQuantity},\
					'${libraryId}', '${shelfLocation}') RETURNING *;`;
	const book = (await client.query(query)).rows[0];
	  
	res.status(201).json({ book });
	return;
});


export const updateBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { bookIsbn } = req.params;
	const updates = req.body;

	// construct update query
	const query = getQuery('UPDATE book SET', updates) +
		` WHERE isbn = '${bookIsbn}' AND library_id = '${libraryId}' RETURNING *;`;
	const updatedBook = (await client.query(query)).rows[0];

	res.json({ updatedBook });
	return;
});


export const deleteBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { bookIsbn } = req.params;
	
	const query = `DELETE FROM book WHERE isbn = '${bookIsbn}' AND library_id = '${libraryId}';`;
	await client.query(query);
	
	res.json(`Book with ISBN: ${bookIsbn} is successfully deleted`);
	return;
});


export const getBooks = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const filter = req.query; // title or author or isbn

	let query = `SELECT * FROM book WHERE library_id = '${libraryId}'`;

	//check if the user wants to list all books or search for a specific book
	if (Object.keys(filter).length !== 0)
		query += ` AND ${Object.keys(filter)[0]} = '${Object.values(filter)[0]}'`;

	const data = (await client.query(query)).rows;
	// check if the book's filter data is not correct
	if (data.length === 0) {
		res.status(400).json({ error: `No books found with ${Object.keys(filter)[0]}: ${Object.values(filter)[0]}`});
		return;
	}

	res.json({ data });
	return;
});
