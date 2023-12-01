const mongoose = require('mongoose');
const Product = require('../models/productModel');
const { prods } = require('./products');
const path = require('path');
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

mongoose.connect(process.env.db_url, {
    useNewUrlParser: true, useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
    console.log("Connected");
});
const seedDB = async () => {
    await Product.deleteMany({});
    for (let i = 0; i < 19; i++) {
        const products = new Product({
            artName: `${prods[i].artName}`,
            description: `${prods[i].description}`,
            price: `${prods[i].price}`,
            category: `${prods[i].category}`,
            creationDate: `${prods[i].creationDate}`,
            image: [
                {
                    url: 'https://res.cloudinary.com/dpue278hq/image/upload/v1699625031/YelpCamp/ioewmwuihf5qca1hud10.png',
                    fileName: 'YelpCamp/ioewmwuihf5qca1hud10'
                }
            ],
            listedBy: `${prods[i].listedBy}`,
        });
        await products.save();

    }
    console.log('saved')
}

seedDB().then(() => {
    mongoose.connection.close();
});