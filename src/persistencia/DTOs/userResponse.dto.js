export default class userResponse{
    constructor(obj){
        this.first_name = obj.first_name;
        this.last_name = obj.last_name;
        this.email = obj.email;
        this.age = obj.age;
        this.role = obj.role;
        this.cart = obj.cart;
    }
}