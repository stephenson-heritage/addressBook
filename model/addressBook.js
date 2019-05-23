const db = require("../config/db");

module.exports = class {
	static async getAddresses() {
		let connection = await db.getConnection();
		const rows = await connection.query(
			"SELECT * FROM `person` JOIN `address` ON `person`.`addressId` = `address`.`addressId`"
		);
		connection.end();
		return rows;
	}

	static async addAddress(p, a) {
		let conn = await db.getConnection();

		const addAddressResult = await conn.query(
			"INSERT INTO `address` (`street`, `city`, `province`, `country`, `postal`) VALUES (?, ?, ?, ?, ?)",
			[a.street, a.city, a.province, a.country, a.postal]
		);

		const addressId = addAddressResult.insertId;

		const addPersonResult = await conn.query(
			"INSERT INTO `person` (`first`, `last`, `phone`, `addressId`) VALUES (?, ?, ?, ?)",
			[p.first, p.last, p.phone, addressId]
		);

		const personId = addPersonResult.insertId;

		conn.end();

		return { addressId: addressId, personId: personId };
	}
};
