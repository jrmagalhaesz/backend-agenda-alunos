const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'agenda_db',
    password: '0159juni',  
    port: 5432,
});

module.exports = pool;
