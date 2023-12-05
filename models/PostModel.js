const DBConnection = require('../db/DBConnection');

class PostModel {
    constructor(id, postText, timePosted, postedBy) {
        this.id = id;
        this.postText = postText;
        this.timePosted = timePosted;
        this.postedBy = postedBy;
    }

    getPostedBy() {
        return this.postedBy;
    }

    static addPostToDB(post_text, time_posted, posted_by) {
        const dbConnection = new DBConnection().getConnection();
        const stmt = dbConnection.prepare('INSERT INTO posts (post_text, time_posted, posted_by) VALUES (?, ?, (SELECT id FROM users WHERE name = ?))');
        const info = stmt.run(post_text, time_posted, posted_by);
        return info;
    }

    static async getAllPosts() {
        const dbConnection = new DBConnection().getConnection();
        var sql = dbConnection.prepare(`
            SELECT posts.id, posts.post_text, posts.time_posted, users.name as posted_by
            FROM posts
            INNER JOIN users ON posts.posted_by = users.id
        `);
        try {
            const rows = await sql.all([])
            console.log(rows);
            return rows;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    static deletePostByID(id) {
        const dbConnection = new DBConnection().getConnection();
        const stmt = dbConnection.prepare('DELETE FROM posts WHERE id = ?');
        const info = stmt.run(id);
        if(info.changes === 1) {
            console.log(`Post with ID: ${id} deleted successfully.`);
        } else {
            console.log(`No post found with ID: ${id}`);
        }
    }
}
module.exports = PostModel;