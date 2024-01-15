import express from 'express';

import { validate } from '../middlewares/dataValidation';
import { checkExistence } from '../middlewares/dbChecks';
import { signUp, signIn } from '../controllers/authControllers';

const router = express.Router();

router.post('/signUp',  validate('signUpSchema'), checkExistence(['libraryName', 'username']), signUp);
router.post('/signIn', validate('signInSchema'), signIn);

export default router;
