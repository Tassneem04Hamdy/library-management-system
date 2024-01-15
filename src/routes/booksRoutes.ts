import express from 'express';

import { validateToken } from '../middlewares/tokenValidation';
import { validate } from '../middlewares/dataValidation';
import { checkExistence } from '../middlewares/dbChecks';
import {
	addBook,
	updateBook,
	deleteBook,
	getBooks
} from '../controllers/bookControllers';

const router = express.Router();

router.post('/', validateToken, validate('addBookSchema'), checkExistence(['isbn']), addBook);
router.patch('/:bookIsbn', validateToken, validate('updateBookSchema'), checkExistence(['bookIsbn']), updateBook);
router.delete('/:bookIsbn', validateToken, checkExistence(['bookIsbn', 'bookBorrowed']), deleteBook);
router.get('/', validateToken, getBooks);

export default router;
