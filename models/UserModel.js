const argon2 = require('argon2');
const DBConnection = require('../db/DBConnection');
const UserFactory = require('../helpers/UserFactory');
const LogService = require('../helpers/LogService');

class UserModel {
    static addUserToDB(name, password, isAdmin) {
        const dbConnection = new DBConnection().getConnection();
        return UserModel.hashPassword(password).then(hashedPassword => {
            const sql = dbConnection.prepare('INSERT INTO users (name, password, isAdmin) VALUES (?, ?, ?)');
            const info = sql.run(name, hashedPassword, isAdmin);
            return info;
        }).catch(err => {
            LogService.log('error', `Error hashing password: ${err}`);
        });
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
        // https://github.com/ranisalt/node-argon2/wiki/Options
        try {
            return argon2.hash(password, {
                type: argon2.argon2id,
                memoryCost: 19456, // 19 MiB
                timeCost: 2, // 2 iterations
                parallelism: 1, // 1 degree of parallelism
            });
        } catch(err) {  
            LogService.log('error', `Error hashing password: ${err}`);
        };
    }

    static authenticate(name, password) {
        const dbConnection = new DBConnection().getConnection();
        return UserModel.hashPassword(password).then(hashedPassword => {
            const stmt = dbConnection.prepare('SELECT * FROM users WHERE name = ?');
            const row = stmt.get(name);
            if (row === undefined) {
                return [false, null];
            }
            // https://www.npmjs.com/package/argon2
            return argon2.verify(row.password, password).then(isMatch => {
                if (isMatch) {
                    return [true, UserFactory.create(row.id, row.name, row.isAdmin)];
                }
                return [false, null];
            }).catch(err => {
                LogService.log('error', `Error verifying password: ${err}`);
                return [false, null];
            });
        } ).catch(err => {
            LogService.log('error', `Error hashing password: ${err}`);
        });
    }
}
module.exports = UserModel;