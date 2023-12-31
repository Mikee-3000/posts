const DBConnection = require('../db/DBConnection');
const LogService = require('../helpers/LogService');

class PostModel {
    static addPostToDB(post_text, time_posted, posted_by) {
        const dbConnection = new DBConnection().getConnection();
        const stmt = dbConnection.prepare('INSERT INTO posts (post_text, time_posted, posted_by) VALUES (?, ?, (SELECT id FROM users WHERE name = ?))');
        // https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#runbindparameters---object
        const info = stmt.run(post_text, time_posted, posted_by);
        return info;
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function
    static async getAllPosts() {
        const dbConnection = new DBConnection().getConnection();
        var sql = dbConnection.prepare(`
            SELECT posts.id, posts.post_text, posts.time_posted, users.name as posted_by
            FROM posts
            INNER JOIN users ON posts.posted_by = users.id
        `);
        try {
            const rows = await sql.all([])
            LogService.log('info', 'Posts retrieved successfully.')
            return rows;
        } catch (err) {
            LogService.log('error', 'Error retrieving posts.')
            return [];
        }
    }

    static deletePostByID(id) {
        const dbConnection = new DBConnection().getConnection();
        const stmt = dbConnection.prepare('DELETE FROM posts WHERE id = ?');
        const info = stmt.run(id);
        if(info.changes === 1) {
            LogService.log('info', `Post with ID: ${id} deleted successfully.`);
        } else {
            LogService.log('error', `Error deleting post with ID: ${id}.`);
        }
    }
}
module.exports = PostModel;