import express from 'express';

import { validate } from '../middlewares/dataValidation';
import { checkExistence } from '../middlewares/dbChecks';
import {
	addBorrower,
	updateBorrower,
	deleteBorrower,
	getBorrowers
} from '../controllers/borrowerControllers';

const router = express.Router();

router.post('/', validate('addBorrowerSchema'),checkExistence(['nid']), addBorrower);
router.patch('/:borrowerId', validate('updateBorrowerSchema'), checkExistence(['borrowerId']), updateBorrower);
router.delete('/:borrowerId', checkExistence(['borrowerId', 'borrowerBorrowing']), deleteBorrower);
router.get('/', getBorrowers);

export default router;
