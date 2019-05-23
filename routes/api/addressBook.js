const router = require("express").Router();
const addressBookController = require("../../controllers/api/addressBook");

router.get("/", (req, res) => {
	addressBookController.allAddresses(req, res);
});

module.exports = router;
