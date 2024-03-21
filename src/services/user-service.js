import UserModel from '../schema/user.schema.js';

export default class UserService {

    constructor() { }

    async add(name, email, password) {
        const user = { name, email, password };
        await UserModel.create(user);
    }
};