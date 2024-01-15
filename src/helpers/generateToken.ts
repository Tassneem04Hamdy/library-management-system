import jwt from 'jsonwebtoken';

export const generateToken = async (libraryId: string) => {
	const secret = process.env.ACCESS_TOKEN_SECRET || 'ACCESS TOKEN SECRET';
	const accessToken = jwt.sign({ libraryId }, secret);

	return accessToken;
};
