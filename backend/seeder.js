import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';

import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
    try {
        fs.readdir(`${path.resolve()}/uploads`, (err, files) => {
            for (const file of files) {
                fs.unlink(`${path.resolve()}/uploads/${file}`, err => {
                    console.log(err);
                })
            }
        });
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;

        const sampleProducts = products.map(product => {
            return {
                ...product,
                user: adminUser
            };
        });
        
        fs.writeFile(`${path.resolve()}/uploads/file.txt`, 'Add to git repo', 'utf8', err => console.log(err));

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        fs.readdir(`${path.resolve()}/uploads`, (err, files) => {
            for (const file of files) {
                fs.unlink(`${path.resolve()}/uploads/${file}`, err => {
                    console.log(err);
                })
            }
        });
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();
        fs.writeFile(`${path.resolve()}/uploads/file.txt`, 'Add to git repo', 'utf8', err => console.log(err));

        console.log('Data Destroyed!'.red.inverse);
        process.exit(1);
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}