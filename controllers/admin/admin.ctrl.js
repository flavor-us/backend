const models = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getContents = async (req, res) => {
	try {
		const [contents] = await Promise.all([models.Contents.findAll({
			where: {
				[Op.and]: {
					filename: {
						[Op.like]: req.query.filename ? ("%" + req.query.filename + "%") : "%" + '' + "%"
					},
					restname: {
						[Op.like]: req.query.restname ? ("%" + req.query.restname + "%") : "%" + '' + "%"
					}
				}
			}
		}
		)]);
		res.render("admin/contents.html", { contents });
	} catch (e) {
		console.log(e);
	}
};
