const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',        // Замените на имя пользователя вашей БД
    host: 'localhost',           // Или адрес вашего сервера БД
    database: 'vkr',    // Замените на имя вашей БД
    password: 'Kitsupakkitsur220864!', // Замените на пароль вашей БД
    port: 1975,                  // Порт PostgreSQL (обычно 5432)
});

module.exports = pool;