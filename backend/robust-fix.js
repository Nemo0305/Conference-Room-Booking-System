const db = require('./db');
const bcrypt = require('bcryptjs');

async function fix() {
    try {
        const email = 'AKD1@iem.edu.in';
        const role = 'admin';
        const pass = 'password123';
        const hashed = await bcrypt.hash(pass, 10);

        console.log('START_FIX');
        const [res] = await db.query('UPDATE users SET userrole_id = ?, password = ? WHERE email = ?', [role, hashed, email]);
        console.log('AFFECTED:' + res.affectedRows);

        const [rows] = await db.query('SELECT uid, email, userrole_id FROM users WHERE email = ?', [email]);
        console.log('RESULT:' + JSON.stringify(rows));
        console.log('END_FIX');
        process.exit(0);
    } catch (err) {
        console.error('ERROR:' + err.message);
        process.exit(1);
    }
}
fix();
