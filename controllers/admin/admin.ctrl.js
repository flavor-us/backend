const models = require("../../models");
const paginate = require("express-paginate");

exports.getContents = async (req, res) => {
	try {
		const [contents] = await Promise.all([models.Contents.findAll()]);
		res.render("admin/contents.html", { contents });
	} catch (e) {
		console.log(e);
	}
};
