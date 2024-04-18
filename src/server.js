import 'dotenv/config';
import express from 'express';
import UserService from './services/user-service.js';
import ProductService from './services/product-service.js';
import authMiddleware from './middlewares/auth.middleware.js';
import { extname } from 'path';

import multer from 'multer';
import crypto from 'crypto';

const app = express();
const port = 3000;
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const newFileName = crypto.randomBytes(32).toString('hex');
        const filenameExtension = extname(file.originalname);
        cb(null, `${newFileName}${filenameExtension}`);
    }
});
const uploadMiddleware = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('TKTênis_API');
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userService = new UserService();
    try {
        const token = await userService.login(email, password);
        return res.status(200).json({ access_token: token });
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }
});

//CREATE PRODUCT
app.post('/products', authMiddleware, uploadMiddleware.single('image'), async (req, res) => {
    const { name, price, stock } = req.body;
    const productService = new ProductService();
    const product = {
        name,
        price,
        stock,
        fileName: req.file.filename
    };
    await productService.add(product);
    return res.status(201).json({ message: 'success' });
});

//READ PRODUCTS
app.get('/products', authMiddleware, async (req, res) => {
    const productService = new ProductService();
    const products = await productService.findAll();
    return res.status(200).json(products);
});

//CREATE
app.post('/users', authMiddleware, async (req, res) => {
    const { name, email, password } = req.body;
    const userService = new UserService();
    await userService.add(name, email, password);
    return res.status(201).json({ message: 'Usuário criado com sucesso' })
});

//READ
app.get('/users', authMiddleware, async (req, res) => {
    const userService = new UserService();
    const users = await userService.findAll();
    return res.status(200).json(users);
});

app.get('/users/:id', authMiddleware, async (req, res) => {
    const id = req.params.id;
    const userService = new UserService();
    const user = await userService.findById(id);
    return res.status(200).json(user);
});

//UPDATE
app.put('/users/:id', authMiddleware, async (req, res) => {
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
app.delete('/users/:id', authMiddleware, async (req, res) => {
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