import express from 'express';

import { validate } from '../middlewares/dataValidation';
import { checkExistence } from '../middlewares/dbChecks';
import {
	addBook,
	updateBook,
	deleteBook,
	getBooks
} from '../controllers/bookControllers';

const router = express.Router();

router.post('/', validate('addBookSchema'), checkExistence(['isbn']), addBook);
router.patch('/:bookIsbn', validate('updateBookSchema'), checkExistence(['bookIsbn']), updateBook);
router.delete('/:bookIsbn', checkExistence(['bookIsbn', 'bookBorrowed']), deleteBook);
router.get('/', getBooks);

export default router;
