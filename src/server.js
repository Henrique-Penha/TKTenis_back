import 'dotenv/config';
import express from 'express';
import UserService from '../src/services/user-service.js';
import authMiddleware from './middlewares/auth.middleware.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(authMiddleware);

app.get('/', (req, res) => {
    res.send('TKTênis_API');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userService = new UserService();
    try {
        const user = await userService.login(email, password);
        return res.status(200).json({ name: user.name, email: user.email })
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});

//CREATE
app.post('/users', async (req, res) => {
    const { name, email, password } = req.body;
    const userService = new UserService();
    await userService.add(name, email, password);
    return res.status(201).json({ message: 'Usuário criado com sucesso' })
});

//READ
app.get('/users/:key', async (req, res) => {
    const userService = new UserService();
    const users = await userService.findAll();
    return res.status(200).json(users);
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const userService = new UserService();
    const user = await userService.findById(id);
    return res.status(200).json(user);
});

//UPDATE
app.put('/users/:id', async (req, res) => {
    const id = req.params.id;
    const { name, email, password } = req.body;
    const user = { name, email, password};
    const userService = new UserService();
    try {
        await userService.update(id, user);
        return res.status(200).json({ message: 'Atualização realizada com sucesso' });
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
});

//DELETE
app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    const userService = new UserService();
    try {
        await userService.delete(id);
        return res.status(200).json({ message: 'Usuário removido com sucesso' });
    } catch (error) {
        return res.status(404).json({ message: error.message })
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});