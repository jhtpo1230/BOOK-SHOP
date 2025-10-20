const mariadb = require('mysql2');

const connection = mariadb.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'BookShop',
    typeCast: function (field, next) {
        if (field.type === 'DATETIME' || field.type === 'TIMESTAMP') {
            return field.string();  // → 문자열로 변환 (예: '2025-09-30 14:09:56')
        }
        return next();
    }
})

module.exports = connection;