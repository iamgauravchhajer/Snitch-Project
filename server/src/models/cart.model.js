import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1
            },
            size: {
                type: String,
                enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
}, {timestamps: true})

const cartModel = mongoose.model('cart', cartSchema);

export default cartModel;