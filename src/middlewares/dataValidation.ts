import express from 'express';
import { z } from 'zod';

export const validate = (validationSchema: string)  => 
	async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		try {
			validationSchemas[validationSchema].parse(req.body);
			next();
		} catch (err: unknown) {
			const error = err as z.ZodError;
			return res.status(400).json({ error: error.errors });
		}
	};

const addBookSchema: z.ZodSchema = z.object({
	isbn: z.string(),
	title: z.string(),
	author: z.string(),
	availableQuantity: z.number(),
	shelfLocation: z.string(),
}).strict();

const updateBookSchema: z.ZodSchema = z.object({
	title: z.string().optional(),
	author: z.string().optional(),
	available_quantity: z.number().optional(),
	shelf_location: z.string().optional(),
}).strict();

const addBorrowerSchema: z.ZodSchema = z.object({
	nid: z.string(),
	name: z.string(),
	email: z.string().optional(),
}).strict();

const updateBorrowerSchema: z.ZodSchema = z.object({
	name: z.string().optional(),
	email: z.string().optional(),
}).strict();

const getOverdueBorrowings: z.ZodSchema = z.object({
	dueDaysNum: z.number(),
}).strict();

const validationSchemas: { [id: string]: z.ZodSchema }= {
	'addBookSchema': addBookSchema,
	'updateBookSchema': updateBookSchema,
	'addBorrowerSchema': addBorrowerSchema,
	'updateBorrowerSchema': updateBorrowerSchema,
	'getOverdueBorrowings': getOverdueBorrowings
};
