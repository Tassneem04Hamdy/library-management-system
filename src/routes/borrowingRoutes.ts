import express from 'express';

import { validate } from '../middlewares/dataValidation';
import { checkExistence } from '../middlewares/dbChecks';
import {
	addBorrowing,
	returnBook,
	getBorrowedBooks,
	getOverdueBorrowings
} from '../controllers/borrowingControllers';

const router = express.Router();

router.post('/borrowers/:borrowerId/books/:bookIsbn', checkExistence(['borrowerId']), addBorrowing);
router.delete('/borrowers/:borrowerId/books/:bookIsbn', checkExistence(['borrowerId', 'bookIsbn']), returnBook);
router.get('/borrowers/:borrowerId', checkExistence(['borrowerId']), getBorrowedBooks);
router.get('/overdue', validate('getOverdueBorrowings'), getOverdueBorrowings);

export default router;
