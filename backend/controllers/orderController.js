import asyncHandler from 'express-async-handler';

import Order from '../models/orderModel.js'

// @desc        Create new order
// @route       POST /api/orders
// @access      Private
export const addOrderItems = asyncHandler(async (req, res) => {
    const { 
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice 
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order Items');
    }

    const order = new Order({
        orderItems, 
        shippingAddress, 
        paymentMethod, 
        itemsPrice, 
        taxPrice, 
        shippingPrice, 
        totalPrice,
        user: req.user._id 
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
});

// @desc        Get order by ID
// @route       GET /api/orders/:id
// @access      Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order
            .findById(req.params.id)
            .populate('user', 'name email');

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    res.json(order);
});

// @desc        Update order to paid
// @route       PUT /api/orders/:id/pay
// @access      Private
export const updateOrderToPay = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    if (order.paymentMethod === "PayPal") {
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address
        };
    }
    
    const updatedOrder = await order.save();

    res.json(updatedOrder);
});

// @desc        Get logged in user orders
// @route       GET /api/orders/myorders
// @access      Private
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders) {
        res.status(404);
        throw new Error('Orders not found');
    }

    res.json(orders);
});