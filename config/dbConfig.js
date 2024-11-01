const { Sequelize } = require('sequelize');

// Memastikan dotenv di-load
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.MYSQL_DB, 
    process.env.MYSQL_USER, 
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',  
        logging: console.log 
    }
);

// Fungsi untuk menguji koneksi
async function connectMySQL() {
    try {
        await sequelize.authenticate();
        console.log('✅ MySQL connected successfully!');
        return sequelize;
    } catch (err) {
        console.error('❌ MySQL connection error:', err);
        return null;
    }
}

module.exports = { connectMySQL, sequelize };
