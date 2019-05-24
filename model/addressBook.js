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

	static async viewAddress(personId) {
		let conn = await db.getConnection();
		const rows = await conn.query(
			"SELECT * FROM `person` JOIN `address` ON `person`.`addressId` = `address`.`addressId` WHERE `personId` = ?",
			[personId]
		);

		if (rows.length === 1) {
			conn.end();
			return rows[0];
		}

		conn.end();
		return {};
	}

	static async deleteAddress(personId) {
		let conn = await db.getConnection();
		const rows = await conn.query(
			"SELECT `addressId` FROM `person` WHERE personId = ?",
			[personId]
		);

		if (rows.length === 1) {
			const addressId = rows[0].addressId;
			conn.query("DELETE FROM `person` WHERE `person`.`personId` = ?", [
				personId
			]);

			conn.query("DELETE FROM `address` WHERE `address`.`addressId` = ?", [
				addressId
			]);

			conn.end();
			return { deleted: { personId: personId, addressId: addressId } };
		}

		conn.end();
		return { deleted: {} };
	}

	static async addAddress(p, a) {
		let conn = await db.getConnection();

		const addAddressResult = await conn.query(
			"INSERT INTO `address` (`street`, `city`, `province`, `country`, `postal`,`latlng`) VALUES (?, ?, ?, ?, ?, PointFromText('POINT(" +
				a.geometry.lat +
				" " +
				a.geometry.lng +
				")'))",
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
