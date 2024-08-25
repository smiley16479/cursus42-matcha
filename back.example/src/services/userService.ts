import { query } from "express";
import { db } from "../configs/db.config";


function getAll(req, res) {
	connection.query(query, (err, results) => {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		res.status(200).json(results);
	});
}

/** Insert */
function createUser(req, res) {
	const { username, password, email } = req.body;
	const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
	
	connection.query(query, [username, password, email], (err, results) => {
	  if (err) {
		return res.status(500).json({ error: err.message });
	  }
	  res.status(201).json({ id: results.insertId, username, email });
	});
}

/** update */
function updateUser(req, res) { // '/users/:id', 
	const { id } = req.params;
	const { username, email } = req.body;
	const query = 'UPDATE users SET username = ?, email = ? WHERE id = ?';
  
	connection.query(query, [username, email, id], (err, results) => {
	  if (err) {
		return res.status(500).json({ error: err.message });
	  }
	  res.status(200).json({ message: 'User updated successfully' });
	});
}

function deleteUser(req, res) { //'/users/:id', 
	const { id } = req.params;
	const query = 'DELETE FROM users WHERE id = ?';
  
	connection.query(query, [id], (err, results) => {
	  if (err) {
		return res.status(500).json({ error: err.message });
	  }
	  res.status(200).json({ message: 'User deleted successfully' });
	});
  }