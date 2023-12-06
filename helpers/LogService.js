const LogModel = require('../models/LogModel');

class LogService {
    static log(level, message) {
        const timestamp = new Date().toISOString();
        const LogModel = require('../models/LogModel');
        console.log(`${timestamp} - ${level} - ${message}`);
        LogModel.addLogToDB(timestamp, level, message);
    }

    static getAllLogs() {
        let logs = LogModel.getAllLogs();
        if (logs === 'error') {
            LogService.log('error', 'Error retrieving logs.')
            return []
        }
        LogService.log('info', 'Logs retrieved successfully.')
        return logs;
    }
}

module.exports = LogService;