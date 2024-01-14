import express from 'express';

import { validate } from '../middlewares/dataValidation';
import {
	addBook,
	updateBook,
	deleteBook,
	getBooks
} from '../controllers/bookControllers';

const router = express.Router();

router.post('/', validate('addBookSchema'), addBook);
router.patch('/:bookIsbn', validate('updateBookSchema'), updateBook);
router.delete('/:bookIsbn', deleteBook);
router.get('/', getBooks);

export default router;
