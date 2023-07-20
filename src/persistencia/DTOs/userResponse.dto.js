export default class userResponse{
    constructor(obj){
        this.first_name = obj.first_name;
        this.last_name = obj.last_name;
        this.email = obj.email;
        this.age = obj.age;
        this.isAdmin = obj.isAdmin;
        this.cart = obj.cart;
    }
}