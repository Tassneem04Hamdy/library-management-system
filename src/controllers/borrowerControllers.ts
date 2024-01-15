import express from 'express';
import asyncHandler from 'express-async-handler';

import client from '../database/dbClient';
import { getQuery } from '../helpers/constructUpdateQuery';

export const addBorrower = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { nid, name, email } = req.body;

	const query = `INSERT INTO borrower(nid, name, email, library_id)\
					VALUES('${nid}', '${name}', '${email}', '${libraryId}') RETURNING *;`;
	const borrower = (await client.query(query)).rows[0];
	  
	res.status(201).json({ borrower });
	return;
});


export const updateBorrower = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { borrowerId } = req.params;
	const updates = req.body;

	// construct update query
	const query = getQuery('UPDATE borrower SET', updates) +
		` WHERE borrower_id = ${borrowerId} AND library_id = '${libraryId}' RETURNING *;`;
	const updatedBorrower= (await client.query(query)).rows[0];

	res.json({ updatedBorrower });
	return;
});


export const deleteBorrower = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const { borrowerId } = req.params;

	const query = `DELETE FROM borrower WHERE borrower_id = ${borrowerId} AND library_id = '${libraryId}';`;
	await client.query(query);
	
	res.json(`Borrower with ID: ${borrowerId} is successfully deleted`);
	return;
});


export const getBorrowers = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryId } = req;
	const query = `SELECT * FROM borrower WHERE library_id = '${libraryId}'`;
	const borrowers = (await client.query(query)).rows;

	res.json({ borrowers });
	return;
});
