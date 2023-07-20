export default class userDBDTO {
    constructor(userObj) {
        this.first_name = userObj.first_name;
        this.last_name = userObj.last_name;
        this.email = userObj.email;
        this.age = userObj.age;
        this.password = userObj.password;
        this.isAdmin = userObj.isAdmin || false;
        this.externalLogin = userObj.externalLogin || false;
        this.githubId = userObj.githubId || null;
        this.googleId = userObj.googleId || null;
        this.cart = userObj.cart;
    }
}