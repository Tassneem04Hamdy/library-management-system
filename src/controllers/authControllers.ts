import express from 'express';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';

import client from '../database/dbClient';
import { generateToken } from '../helpers/generateToken';

export const signUp = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { libraryName, username } = req.body;
	let {password } = req.body;
	password = await bcrypt.hash(password, 10);

	const query = `INSERT INTO library(library_name, username, password)\
	VALUES('${libraryName}', '${username}', '${password}') RETURNING *;`;
	const libraryAdmin = (await client.query(query)).rows[0];
	  
	res.status(201).json({ libraryAdmin });
	return;
});

export const signIn = asyncHandler(async (req: express.Request, res: express.Response) => {
	const { username, password } = req.body;
	
	// check if the username is not correct
	const query = `SELECT library_id, library_name, password FROM library WHERE username = '${username}';`;
	const data = (await client.query(query)).rows[0];
	if (!data) {
		res.status(400).json({ error: `No users found with username: ${username}`});
		return;
	}

	const validPassword = await bcrypt.compare(password, data.password);
	if (!validPassword) {
		res.status(401).json({ error: 'Wrong password' });
		return;
	}

	const accessToken = await generateToken(data.library_id);
	res.header('auth-token', `Bearer ${accessToken}`).json({ username, libraryName: data.library_name });
	return;
});
