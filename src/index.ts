import express from 'express';
import bodyParser from 'body-parser';

require('dotenv').config();

import client from './database/dbClient';
import authRouter from './routes/authRoutes';
import bookRouter from './routes/booksRoutes';
import borrowerRouter from './routes/borrowerRoutes';
import borrowingRouter from './routes/borrowingRoutes';

const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);
app.use('/books', bookRouter);
app.use('/borrowers', borrowerRouter);
app.use('/borrowings', borrowingRouter);

(async function () {

	try {

		// connect to postgres database
		client.connect()
			.then(() => {
				app.listen(port, () => {
					console.log('connected to database');
					console.log(`server is running on port ${port}`);
				});
			})
			.catch(err => {
				console.error('failed to connect to postgres database:\n', err);
				process.exit(1);
			});

		// 404 handler
		app.use((_req: express.Request, res: express.Response, _next: express.NextFunction) => {
			res.status(404).json({
				status: 404,
				message: 'Page not found!'
			});
		});

		// error handler
		app.use(((err, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
			res.status(err.status).json({
				status: err.status,
				message: err.message
			});

		}) as express.ErrorRequestHandler);

	} catch (error) {
		console.log(`Error! ${error}`);
		process.exit(1);
	}
})();
