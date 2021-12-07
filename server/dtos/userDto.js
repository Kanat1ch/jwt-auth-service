class UserDto {
    username;
    name;
    surname;
    sex;
    email;
    phone;
    image;
    id;
    mailVerified;
    phoneVerified;

    constructor(user) {
        this.username = user.username
        this.name = user.name
        this.surname = user.surname
        this.sex = user.sex
        this.email = user.email
        this.phone = user.phone
        this.image = user.image
        this.id = user.id
        this.mailVerified = user.mailVerified
        this.phoneVerified = user.phoneVerified
    }
}

module.exports = UserDto