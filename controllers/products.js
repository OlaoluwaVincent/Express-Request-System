const Product = require('../models/product');

const getAllProducts = async (req, res) => {
	// Get the values from the request
	const { name, featured, company, sort, fields, numericFilters } = req.query;
	const queryObject = {};
	if (featured) {
		//set the values in the queryobject
		queryObject.featured = featured === 'true' ? true : false;
	}
	if (company) {
		//set the values in the queryobject
		queryObject.company = company;
	}
	if (name) {
		//set the values in the queryobject
		queryObject.name = { $regex: name, $options: 'i' };
	}
	if (numericFilters) {
		const operatorMap = {
			'>': '$gt',
			'>=': '$gte',
			'=': '$eq',
			'<': '$lt',
			'<=': '$lte',
		};
		const regEx = /\b(<|>|>=|=|<|<=)\b/g;
		let filters = numericFilters.replace(
			regEx,
			(match) => `-${operatorMap[match]}-`
		);
		const options = ['price', 'rating'];
		filters = filters.split(',').forEach((item) => {
			const [field, operator, value] = item.split('-');
			if (options.includes(field)) {
				queryObject[field] = { [operator]: Number(value) };
			}
		});
	}

	//chain conditioners
	let result = Product.find(queryObject);

	//sorted Items
	if (sort) {
		const sortList = sort.split(',').join(' ');
		result = result.sort(sortList);
	} else {
		result = result.sort('createdAt');
	}
	//field names
	if (fields) {
		let fieldList = fields.split(',').join(' ');
		result = result.select(fieldList);
	}
	// pagination
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;

	result = result.skip(skip).limit(limit);
	//

	const products = await result;
	res.status(200).json({ length: products.length, products });
	if (!products) {
		throw new Error(products);
	}
};

module.exports = {
	getAllProducts,
};
