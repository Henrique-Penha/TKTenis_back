import Mongoose from '../database/db.js';

const productSchema = new Mongoose.Schema(
    {
        name: String,
        price: Number,
        stock: Number,
        fileName: String
    },
    {
        collection: 'products',
        timestamps: true
    }
);

export default Mongoose.model('products', productSchema, 'products');