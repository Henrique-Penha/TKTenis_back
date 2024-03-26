import { ObjectId } from 'mongodb';
import UserModel from '../schema/user.schema.js';
import { error } from 'console';

export default class UserService {

    constructor() { }

    async add(name, email, password) {
        const user = { name, email, password };
        await UserModel.create(user);
    }

    async findAll() {
        return await UserModel.find({});
    }

    async findById(id) {
        return await UserModel.findById(new ObjectId(id));
    }

    async update(id, user) {
        const findUser = await this.findById(id);
        if (!findUser) throw new Error('Usuário não encontrado');
        return await UserModel.updateOne({ _id: new ObjectId(id) }, user);
    }

    async delete(id) {
        const user = await this.findById(id);
        if (!user) throw new Error('Usuário não encontrado');
        return await UserModel.deleteOne({ _id: new ObjectId(id) });
    }
};