import express from 'express';
import asyncHandler from 'express-async-handler';

import client from '../database/dbClient';
import { getQuery } from '../helpers/constructUpdateQuery';

export const addBorrower = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { nid, name, email } = req.body;

	// check if borrower already exists
	let query = `SELECT EXISTS(SELECT 1 FROM borrower WHERE nid = '${nid}');`;
	const borrowerFound = (await client.query(query)).rows[0].exists;
	if (borrowerFound) {
		res.status(400).json({ error: `Borrower with NID: ${nid} already exists`});
		return;
	}

	query = `INSERT INTO borrower(nid, name, email) VALUES('${nid}', '${name}', '${email}') RETURNING *;`;
	const borrower = (await client.query(query)).rows[0];
	  
	res.status(201).json({ borrower });
	return;
});


export const updateBorrower = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { borrowerId } = req.params;
	const updates = req.body;

	// check if the borrower's id is not correct
	let query = `SELECT EXISTS(SELECT 1 FROM borrower WHERE borrower_id = ${borrowerId});`;
	const borrowerFound = (await client.query(query)).rows[0].exists;
	if (!borrowerFound) {
		res.status(400).json({ error: `No borrowers found with ID: ${borrowerId}`});
		return;
	}

	// construct update query
	query = getQuery('UPDATE borrower SET', updates) + ` WHERE borrower_id = ${borrowerId} RETURNING *;`;
	const updatedBorrower= (await client.query(query)).rows[0];

	res.json({ updatedBorrower });
	return;
});


export const deleteBorrower = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { borrowerId } = req.params;

	// check if the borrower's id is not correct
	let query = `SELECT EXISTS(SELECT 1 FROM borrower WHERE borrower_id = ${borrowerId});`;
	const borrowerFound = (await client.query(query)).rows[0].exists;
	if (!borrowerFound) {
		res.status(400).json({ error: `No borrowers found with ID: ${borrowerId}`});
		return;
	}

	// check if the borrower is still borrowing books
	query = `SELECT EXISTS(SELECT 1 FROM borrowing WHERE borrower_id = ${borrowerId});`;
	const borrowerBorrowing = (await client.query(query)).rows[0].exists;
	if (borrowerBorrowing) {
		res.status(409).json({ error: 'Can not delete as borrower is still borrowing book(s)'});
		return;
	}

	query = `DELETE FROM borrower WHERE borrower_id = ${borrowerId};`;
	await client.query(query);
	
	res.json(`Borrower with ID: ${borrowerId} is successfully deleted`);
	return;
});


export const getBorrowers = asyncHandler(async (req: express.Request, res: express.Response) => {
	const query = 'SELECT * FROM borrower';
	const borrowers = (await client.query(query)).rows;

	res.json({ borrowers });
	return;
});
