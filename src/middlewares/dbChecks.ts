import express from 'express';

import client from '../database/dbClient';

export const checkExistence = (fields: string[])  =>
	async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			for (const field of fields) {
				const value = req.params[field] || req.body[field];
				const query = `SELECT EXISTS(SELECT 1 FROM ${data[field].table} WHERE ${data[field].column} = '${value}');`;
				const isFound = (await client.query(query)).rows[0].exists;
				if (data[field].expected !== isFound) {
					res.status(400).json({ error: `${data[field].errorMsg} ${value}`});
					return;
				}
			}
			next();
		} catch (err) {
			return res.status(400).json({ error: err });
		}
	};

const data: { [id: string]: { table: string, column: string, errorMsg: string, expected: boolean } } = {
	'isbn': { 
		table: 'book',
		column: 'isbn',
		errorMsg: 'This book already exists, ISBN:',
		expected: false,
	},

	'bookIsbn': {
		table: 'book',
		column: 'isbn',
		errorMsg: 'No books found with ISBN:',
		expected: true,
	},

	'bookBorrowed': {
		table: 'borrowing',
		column: 'book_isbn',
		errorMsg: 'Can not delete a book data while it is borrowed, ISBN:',
		expected: false,
	},

	'nid':	{
		table: 'borrower',
		column: 'nid',
		errorMsg: 'This Borrower already exists, NID:',
		expected: false,
	},

	'borrowerId': { 
		table: 'borrower',
		column: 'borrower_id',
		errorMsg: 'No borrowers found with ID:',
		expected: true,
	},

	'borrowerBorrowing': { 
		table: 'borrowing',
		column: 'borrower_id',
		errorMsg: 'Can not delete a borrower that still borrowing book(s), ID:',
		expected: false },
};
