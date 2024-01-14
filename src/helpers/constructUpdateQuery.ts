export const getQuery = (query: string, updates: { [x: string]: unknown }): string => {
	let delimiter = ' ';
	for (const key in updates) {
		query += `${delimiter}${key} = `;
		if (typeof updates[key] === 'string')
			query += `'${updates[key]}'`;
		else
			query += `${updates[key]}`;
		delimiter = ', ';
	}

	return query;
};
