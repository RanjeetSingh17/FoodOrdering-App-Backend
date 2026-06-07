const Pool = require("pg").Pool;
const fs = require('fs');
require('dotenv').config();


const pool = new Pool({
    connectionString : process.env.CONNECTIONSTRING,
    ssl: {
        rejectUnauthorized: false,  // For development, you can set it to false. Set it to true in production for security.
      },
});
pool.connect((err) => {
    if (err) {
        console.log("Error Connecting to the Database", err);
        return
    } else {
        console.log("Connected to the Database")
    }
})

// ek setup.sql krke file banai wha se tum database table update kr skte ho apne hisab wha changes krne k baad isko uncommit krke node db.js run krna tbhi database mai table update hogi 
// but koshish krna ki jo table tum update kroge bs whi change ho baaki sbko commit krdena taaki data remvoe na ho

// async function setupDatabase() {
//     try {
//         const sql = fs.readFileSync('setup.sql', 'utf8');
//         const client = await pool.connect();
        
//         try {
//             await client.query(sql);
//             console.log('Database setup completed successfully');
//         } finally {
//             client.release();
//         }
//     } catch (err) {
//         console.error('Error setting up database:', err);
//     } 
// }

// setupDatabase();

module.exports = pool;
