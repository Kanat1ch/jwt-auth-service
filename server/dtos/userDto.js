class UserDto {
    username;
    email;
    id;
    isActivated

    constructor(user) {
        this.username = user.username
        this.email = user.email
        this.id = user.id
        this.isActivated = user.isActivated
    }
}

module.exports = UserDto