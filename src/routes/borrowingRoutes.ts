import express from 'express';

import { validate } from '../middlewares/dataValidation';
import {
	addBorrowing,
	returnBook,
	getBorrowedBooks,
	getOverdueBorrowings
} from '../controllers/borrowingControllers';

const router = express.Router();

router.post('/borrowers/:borrowerId/books/:bookIsbn', addBorrowing);
router.delete('/borrowers/:borrowerId/books/:bookIsbn', returnBook);
router.get('/borrowers/:borrowerId', getBorrowedBooks);
router.get('/overdue', validate('getOverdueBorrowings'), getOverdueBorrowings);

export default router;
