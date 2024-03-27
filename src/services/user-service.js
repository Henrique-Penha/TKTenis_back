import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
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

    async findByEmail(email) {
        return await UserModel.findOne({ email: email });
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

    async login(email, password) {
        if(!email && !password) throw new Error('Falha no login');
        const user = await this.findByEmail(email);
        if(!user) throw new Error('Usuário não encontrado');
        const auth = user.password === password;
        if(!auth) throw new Error('Senha errada');
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign({ user }, secretKey, { expiresIn: "3600s" });
        return token;
    }
};