const bcrypt = require('bcrypt');
const saltRounds = 10;
const DBConnection = require('../db/DBConnection');

class UserModel {
    constructor(id, name, password, isAdmin) {
        this.id = id;
        this.name = name;
        this.password = password;
        this.isAdmin = isAdmin;
    }

    getIsAdmin() {
        return this.isAdmin;
    }

    setIsAdmin(isAdmin) {
        this.isAdmin = isAdmin;
    }

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
}
module.exports = UserModel;