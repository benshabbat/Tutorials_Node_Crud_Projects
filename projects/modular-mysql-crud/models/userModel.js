// User Model - Database queries
// User model - database queries

import pool from '../config/db.js';

class User {
  // Get all users
  static async getAll() {
    const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at DESC');
    return rows;
  }

  // Get user by ID
  static async getById(id) {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  // Create new user
  static async create(userData) {
    const { name, email, age } = userData;
    const [result] = await pool.query(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age || null]
    );
    return result.insertId;
  }

  // Update user
  static async update(id, userData) {
    const { name, email, age } = userData;
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age || null, id]
    );
    return result.affectedRows > 0;
  }

  // Delete user
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  // Count users
  static async count() {
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM users');
    return rows[0].total;
  }

  // Statistics
  static async getStats() {
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM users');
    const [avgResult] = await pool.query('SELECT AVG(age) as avgAge FROM users');
    const [minMaxResult] = await pool.query(
      'SELECT MIN(age) as minAge, MAX(age) as maxAge FROM users'
    );

    return {
      totalUsers: countResult[0].total,
      averageAge: avgResult[0].avgAge ? Math.round(avgResult[0].avgAge) : null,
      minAge: minMaxResult[0].minAge,
      maxAge: minMaxResult[0].maxAge
    };
  }
}

export default User;
