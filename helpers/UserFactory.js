class UserFactory {
    static create(id, username, isAdmin) {
        return {
            id: id,
            username: username,
            isAdmin: isAdmin
        }
    }
}
module.exports = UserFactory;