const models = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getContents = async (req, res) => {
	try {
		const [contents] = await Promise.all([models.Contents.findAll({
			where: {
				...('name' in req.query && req.query.name ? {
					filename: {
						[Op.like]: "%" + req.query.name + "%"
					}
				} : '')
			}
		}
		)]);
		res.render("admin/contents.html", { contents });
	} catch (e) {
		console.log(e);
	}
};
