// import { query } from "express";


function getAll() {
	connection.query(query, (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.status(200).json(results);
	});
}