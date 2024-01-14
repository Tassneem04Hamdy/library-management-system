import { Client } from 'pg';

const DB_HOST: string = process.env.DB_HOST || 'localhost';
const DB_USER: string = process.env.DB_USER || 'postgres';
const DB_PASSWORD: string = process.env.DB_PASSWORD || 'root';
const DB_PORT = process.env.DB_PORT || 5432;
const DB_NAME: string = process.env.DB_NAME || 'db-name';

const client = new Client({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	port: Number(DB_PORT),
	database: DB_NAME,
});

export default client;
