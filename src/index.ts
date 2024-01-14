import express from 'express';
import bodyParser from 'body-parser';

require('dotenv').config();

import client from './database/dbClient';

const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

	} catch (error) {
		console.log(`Error! ${error}`);
		process.exit(1);
	}
})();
