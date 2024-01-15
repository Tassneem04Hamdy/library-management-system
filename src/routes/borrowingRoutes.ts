import express from 'express';

import { validateToken } from '../middlewares/tokenValidation';
import { validate } from '../middlewares/dataValidation';
import { checkExistence } from '../middlewares/dbChecks';
import {
	addBorrowing,
	returnBook,
	getBorrowedBooks,
	getOverdueBorrowings
} from '../controllers/borrowingControllers';

const router = express.Router();

router.post('/borrowers/:borrowerId/books/:bookIsbn', validateToken, checkExistence(['borrowerId']), addBorrowing);
router.delete('/borrowers/:borrowerId/books/:bookIsbn', validateToken,
	checkExistence(['borrowerId', 'bookIsbn']), returnBook);
router.get('/borrowers/:borrowerId', validateToken, checkExistence(['borrowerId']), getBorrowedBooks);
router.get('/overdue', validateToken, validate('getOverdueBorrowings'), getOverdueBorrowings);

export default router;
