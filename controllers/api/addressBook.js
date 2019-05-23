const addressBookModel = require("../../model/addressBook");

module.exports = class {
	static async allAddresses(req, res) {
		const data = await addressBookModel.getAddresses();

		return res.json(data);
	}
};
