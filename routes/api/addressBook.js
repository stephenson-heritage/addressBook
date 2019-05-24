const router = require("express").Router();
const addressBookController = require("../../controllers/addressBook");

router.get("/", (req, res) => {
	const result = addressBookController.allAddresses(req, res);

	return result;
});

router.get("/viewAddress/:id", (req, res) => {
	const id = parseInt(req.params.id);
	return addressBookController.viewAddress(req, res, id);
});

router.get("/deleteAddress/:id", (req, res) => {
	const id = parseInt(req.params.id);
	return addressBookController.deleteAddress(req, res, id);
});

router.post("/addAddress/", (req, res) => {
	const result = addressBookController.addAddress(req, res);
	return result;
});

module.exports = router;
