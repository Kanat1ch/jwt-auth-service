class UserDto {
    username;
    name;
    surname;
    sex;
    email;
    phone;
    image;
    id;
    isActivated;
    activationLink;

    constructor(user) {
        this.username = user.username
        this.name = user.name
        this.surname = user.surname
        this.sex = user.sex
        this.email = user.email
        this.phone = user.phone
        this.image = user.image
        this.id = user.id
        this.isActivated = user.isActivated
        this.activationLink = user.activationLink
    }
}

module.exports = UserDto