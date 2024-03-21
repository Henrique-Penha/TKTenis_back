import 'dotenv/config';
import express from 'express';
import UserService from '../src/services/user-service.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('TKTênis_API');
});

app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    const user = new UserService();
    user.add(name, email, password);
    res.statusCode = 201;
    res.json({ message: 'success' })
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});