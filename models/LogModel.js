const DBConnection = require('../db/DBConnection');
const LogService = require('../helpers/LogService');

class LogModel {
    static addLogToDB(timestamp, level, message) {
        const dbConnection = new DBConnection().getConnection();
        const stmt = dbConnection.prepare('INSERT INTO logs (timestamp, level, message) VALUES (?, ?, ?)');
        const info = stmt.run(timestamp, level, message);
        return info;
    }

    static getAllLogs() {
        const dbConnection = new DBConnection().getConnection();
        // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#preparestring---statement
        var sql = dbConnection.prepare(`
            SELECT * FROM logs;
        `);
        try {
            // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#allbindparameters---array-of-rows
            const rows = sql.all([])
            return rows;
        } catch (err) {
            console.log(err);
            return 'error'
        }
    }
}

module.exports = LogModel;