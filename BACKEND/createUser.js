const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

async function updateUserPassword() {
  try {
    const password = 'password123';
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const query = `
      UPDATE users 
      SET password_hash = $1
      WHERE username = $2
      RETURNING user_id, username, full_name, email, role
    `;
    
    const values = [password_hash, 'test_user'];
    const result = await db.query(query, values);
    
    if (result.rows.length === 0) {
      console.log('User not found');
    } else {
      console.log('User password updated successfully:', result.rows[0]);
    }
    process.exit(0);
  } catch (error) {
    console.error('Error updating user:', error);
    process.exit(1);
  }
}

updateUserPassword(); 