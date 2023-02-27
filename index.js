require('dotenv').config();
require('express-async-errors');
const express = require('express');
const connectDB = require('./db/connect');
const productRouter = require('./routes/products');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');

const port = process.env.PORT || 9001;
// initialize express
const app = express();

// Testing routes
app.get('/', (req, res) => {
	res.send('<h1>Store Api</h1><a href="/api/v1/products">Product routes</a>');
});

app.use('/api/v1/products', productRouter);

// custom middleware
app.use(notFound);
app.use(errorHandler);

// Connect to DB and Spin up the server
const start = async () => {
	try {
		await connectDB();
		app.listen(port, () =>
			console.log(`Server is Listening on port: ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
