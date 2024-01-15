import express from 'express';
import asyncHandler from 'express-async-handler';

import client from '../database/dbClient';

export const addBorrowing = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { borrowerId, bookIsbn } = req.params;

	// check if the book's ISBN is not correct OR there no books left
	let query = `SELECT available_quantity FROM book WHERE isbn = '${bookIsbn}' AND library_id = '${libraryId}';`;
	const data = (await client.query(query)).rows[0];
	if (!data) {
		res.status(400).json({ error: `No books found with ISBN: ${bookIsbn}`});
		return;
	}
	else if (data['available_quantity'] === 0) {
		res.status(400).json({ error: `All books with ISBN: ${bookIsbn} are borrowed`});
		return;
	}
	
	// check if borrower already borrowed this book
	query = `SELECT EXISTS(SELECT 1 FROM borrowing\
		WHERE borrower_id = ${borrowerId} AND book_isbn = '${bookIsbn}' AND library_id = '${libraryId}');`;
	const borrowingFound = (await client.query(query)).rows[0].exists;
	if (borrowingFound) {
		res.status(400).json({ error: `Borrower with ID: ${borrowerId} already borrowing book of ISBN: ${bookIsbn}`});
		return;
	}

	let borrowing, updatedBook;
	try {
		await client.query('BEGIN;');
		query = `INSERT INTO borrowing(borrower_id, book_isbn, library_id)\
			VALUES(${borrowerId}, '${bookIsbn}', '${libraryId}') RETURNING *;`;
		borrowing = (await client.query(query)).rows[0];

		query = `UPDATE book SET available_quantity = available_quantity - 1\
			WHERE isbn = '${bookIsbn}' AND library_id = '${libraryId}' RETURNING *;`;
		updatedBook = (await client.query(query)).rows[0];
		await client.query('COMMIT;');
	}
	
	catch (error) {
		await client.query('ROLLBACK;');
		res.status(500).json({ error: 'Oops, something went wrong, try again later' });
		return;
	}

	res.status(201).json({ borrowing, updatedBook });
	return;
});


export const returnBook = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { borrowerId, bookIsbn } = req.params;

	let query = '';
	try {
		await client.query('BEGIN;');

		query = `DELETE FROM borrowing\
			WHERE borrower_id = ${borrowerId} AND book_isbn = '${bookIsbn}' AND library_id = '${libraryId}';`;
		const { rowCount } = await client.query(query);
		// check if this borrower really borrowed this book
		if (!rowCount) {
			res.status(400).json({ error: `Borrower of ID ${borrowerId} didn't borrow book of ISBN ${bookIsbn}`});
			return;
		}

		query = `UPDATE book SET available_quantity = available_quantity + 1\
			WHERE isbn = '${bookIsbn}' AND library_id = '${libraryId}' RETURNING *;`;
		await client.query(query);
		
		await client.query('COMMIT;');
	}
	
	catch (error) {
		await client.query('ROLLBACK;');
		res.status(500).json({ error: 'Oops, something went wrong, try again later' });
		return;
	}

	res.json('Borrowed book is successfully returned');
	return;
});


export const getBorrowedBooks = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { borrowerId } = req.params;

	const query = `SELECT * FROM borrowing WHERE borrower_id = ${borrowerId} AND library_id = '${libraryId}';`;
	const borrowings = (await client.query(query)).rows;

	res.json({ borrowings });
	return;
});


export const getOverdueBorrowings = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { dueDaysNum } = req.body;

	const query = `SELECT * FROM borrowing\
		WHERE (now()::date) - borrowing_date >= ${dueDaysNum} AND library_id = '${libraryId}';`;
	const overdueBorrowings = (await client.query(query)).rows;

	res.json({ overdueBorrowings });
	return;
});
