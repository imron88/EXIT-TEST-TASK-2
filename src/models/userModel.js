/**
 * In-memory User Data Store
 * Provides helper functions for CRUD operations on users.
 */
let users = [];
let nextId = 1;

const userModel = {
  /**
   * Find a user by their email address (case-insensitive)
   * @param {string} email 
   * @returns {object|null}
   */
  findByEmail(email) {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    return users.find(u => u.email.toLowerCase() === normalized) || null;
  },

  /**
   * Find a user by their unique ID
   * @param {number|string} id 
   * @returns {object|null}
   */
  findById(id) {
    const numericId = parseInt(id, 10);
    return users.find(u => u.id === numericId) || null;
  },

  /**
   * Create a new user
   * @param {object} param0 
   * @param {string} param0.name
   * @param {string} param0.email
   * @param {string} param0.password - Hashed password
   * @param {string} param0.role - 'student' or 'admin'
   * @returns {object} The created user object (including id & createdAt)
   */
  create({ name, email, password, role = 'student' }) {
    const newUser = {
      id: nextId++,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password, // hashed password
      role: role.toLowerCase(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    return newUser;
  },

  /**
   * Retrieve all users with role 'student' (omitting password)
   * @returns {Array<object>}
   */
  findAllStudents() {
    return users
      .filter(u => u.role === 'student')
      .map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  },

  /**
   * Retrieve all users (omitting password)
   * @returns {Array<object>}
   */
  findAll() {
    return users.map(({ password, ...userWithoutPassword }) => userWithoutPassword);
  },

  /**
   * Reset store (used for tests)
   */
  clear() {
    users = [];
    nextId = 1;
  }
};

module.exports = userModel;
