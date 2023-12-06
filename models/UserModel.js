const bcrypt = require('bcrypt');
const saltRounds = 10;
const DBConnection = require('../db/DBConnection');
const UserFactory = require('../helpers/UserFactory');

class UserModel {
    static addUserToDB(name, password, isAdmin) {
        const dbConnection = new DBConnection().getConnection();
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const sql = dbConnection.prepare('INSERT INTO users (name, password, isAdmin) VALUES (?, ?, ?)');
        const info = sql.run(name, hashedPassword, isAdmin);
        return info;
    }

    static adminExists() {
        const dbConnection = new DBConnection().getConnection();
        const stmt = dbConnection.prepare('SELECT COUNT(*) as count FROM users WHERE isAdmin = 1');
        const row = stmt.get();
        return row.count > 0;
    }

    static hashPassword(password) {
        const saltRounds = 10;
        return bcrypt.hashSync(passw, saltRounds);
    }

    static authenticate(name, password) {
        const dbConnection = new DBConnection().getConnection();
        const stmt = dbConnection.prepare('SELECT * FROM users WHERE name = ?');
        const row = stmt.get(name);
        if (row === undefined) {
            return [false, null];
        }
        if (bcrypt.compareSync(password, row.password)) {
            return [true, UserFactory.create(row.id, row.name, row.isAdmin)];
        }
        return [false, null];
    }
}
module.exports = UserModel;