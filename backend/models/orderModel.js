import mongoose from 'mongoose';

const { Schema, model } = mongoose;
const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            qty: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            product: {
                type: Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
        }
    ],
    shippingAddress: {
        address: {
           type: String,
           required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
    },
    paymentMethod: {
       type: String,
       required: true
    },
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String }
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false
    },
    paidAt: {
        type: Date
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false
    },
    delieveredAt: {
        type: Date
    }  
}, {
    timestamps: true
});

export default model('Order', orderSchema);