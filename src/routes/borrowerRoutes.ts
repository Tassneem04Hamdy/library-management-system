import express from 'express';

import { validate } from '../middlewares/dataValidation';
import {
	addBorrower,
	updateBorrower,
	deleteBorrower,
	getBorrowers
} from '../controllers/borrowerControllers';

const router = express.Router();

router.post('/', validate('addBorrowerSchema'), addBorrower);
router.patch('/:borrowerId', validate('updateBorrowerSchema'), updateBorrower);
router.delete('/:borrowerId', deleteBorrower);
router.get('/', getBorrowers);

export default router;
