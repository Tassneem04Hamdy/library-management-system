import express from 'express';

import { validateToken } from '../middlewares/tokenValidation';
import { validate } from '../middlewares/dataValidation';
import { checkExistence } from '../middlewares/dbChecks';
import {
	addBorrower,
	updateBorrower,
	deleteBorrower,
	getBorrowers
} from '../controllers/borrowerControllers';

const router = express.Router();

router.post('/', validateToken, validate('addBorrowerSchema'),checkExistence(['nid']), addBorrower);
router.patch('/:borrowerId', validateToken, validate('updateBorrowerSchema'),
	checkExistence(['borrowerId']), updateBorrower);
router.delete('/:borrowerId', validateToken, checkExistence(['borrowerId', 'borrowerBorrowing']), deleteBorrower);
router.get('/', validateToken, getBorrowers);

export default router;
