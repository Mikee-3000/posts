const bcrypt = require('bcrypt');
const md5 = require('js-md5');
const saltRounds = 10;
const DBConnection = require('../db/DBConnection');
const UserFactory = require('../helpers/UserFactory');

class UserModel {
    static addUserToDB(name, password, isAdmin) {
        const dbConnection = new DBConnection().getConnection();
        const hashedPassword = UserModel.hashPassword(password);
        const sql = dbConnection.prepare('INSERT INTO users (name, password, isAdmin) VALUES (?, ?, ?)');
        const info = sql.run(name, hashedPassword, isAdmin);
        return info;
    }

    static userExists(name) {
        const dbConnection = new DBConnection().getConnection();
        const stmt = dbConnection.prepare('SELECT COUNT(*) as count FROM users WHERE name = ?');
        const row = stmt.get(name);
        return row.count > 0;
    }

    static register(name, password) {
        if (UserModel.userExists(name)) {
            return [false, null];
        }
        const info = UserModel.addUserToDB(name, password, 0);
        return [true, UserFactory.create(info.lastInsertRowid, name, 0)];
    }

    static adminExists() {
        const dbConnection = new DBConnection().getConnection();
        const stmt = dbConnection.prepare('SELECT COUNT(*) as count FROM users WHERE isAdmin = 1');
        const row = stmt.get();
        return row.count > 0;
    }

    static hashPassword(password) {
        // insecure
        var hash = md5.create();
        hash.update(password);
        return hash.hex();
        // const saltRounds = 10;
        // return bcrypt.hashSync(password, saltRounds);
    }

    static authenticate(name, password) {
        const dbConnection = new DBConnection().getConnection();
        // insecure
        let hPass = UserModel.hashPassword(password);
        const row = dbConnection.prepare("SELECT * FROM users WHERE name = '" + name + "' and password = '" + hPass + "'").all()[0];
        // const stmt = dbConnection.prepare('SELECT * FROM users WHERE name = ?');
        // const row = stmt.get(name);
        if (row === undefined) {
            return [false, null];
        }
        // insecure
        return [true, UserFactory.create(row.id, row.name, row.isAdmin)];
        // if (bcrypt.compareSync(password, row.password)) {
        //     return [true, UserFactory.create(row.id, row.name, row.isAdmin)];
        // }
        // return [false, null];
    }
}
module.exports = UserModel;