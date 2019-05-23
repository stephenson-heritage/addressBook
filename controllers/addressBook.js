const addressBookModel = require("../model/addressBook");

module.exports = class {
	static async allAddresses(req, res) {
		const data = await addressBookModel.getAddresses();

		return res.json(data);
	}

	static async addAddress(req, res) {
		const data = req.body;

		let p = {
			first: data.first == undefined ? "" : data.first,
			last: data.last == undefined ? "" : data.last,
			phone: data.phone == undefined ? "" : data.phone
		};

		let a = {
			street: data.street == undefined ? "" : data.street,
			city: data.city == undefined ? "" : data.city,
			province: data.province == undefined ? "" : data.province,
			country: data.country == undefined ? "" : data.country,
			postal: data.postal == undefined ? "" : data.postal
		};

		const result = await addressBookModel.addAddress(p, a);
		return res.json(result);
	}
};
