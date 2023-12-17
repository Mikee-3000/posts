const Database = require('better-sqlite3');

class DBConnection {
    constructor() {
        if (DBConnection.instance) {
            return DBConnection.instance;
        }

        // https://github.com/WiseLibs/better-sqlite3
        this.db = new Database('./db.sqlite');
        this.db.exec('PRAGMA foreign_keys = ON');
        DBConnection.instance = this;
    }

    getConnection() {
        return this.db;
    }
}

module.exports = DBConnection;