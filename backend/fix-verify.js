const db = require('./db');
const bcrypt = require('bcryptjs');

async function fixAndVerify() {
    try {
        const email = 'AKD1@iem.edu.in';
        const hashedPassword = await bcrypt.hash('password123', 10);

        console.log('--- Current users ---');
        const [usersBefore] = await db.query('SELECT uid, email, userrole_id FROM users');
        console.log(usersBefore);

        console.log(`\nUpdating ${email} to 'admin'...`);
        const [res] = await db.query('UPDATE users SET userrole_id = ?, password = ? WHERE email = ?', ['admin', hashedPassword, email]);
        console.log('Affected rows:', res.affectedRows);

        console.log('\n--- Users after update ---');
        const [usersAfter] = await db.query('SELECT uid, email, userrole_id FROM users');
        console.log(usersAfter);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
fixAndVerify();
