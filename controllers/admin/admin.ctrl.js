const models = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getContents = async (req, res) => {
	try {
		const [contents] = await Promise.all([models.Contents.findAll({
			where: {
				[Op.and]: {
					restname: {
						[Op.like]: req.query.restname ? ("%" + req.query.restname + "%") : "%" + '' + "%"
					},
					filename: {
						[Op.like]: req.query.filename ? ("%" + req.query.filename + "%") : "%" + '' + "%"
					},
					user_id: {
						[Op.like]: req.query.user_id ? req.query.user_id : "%" + '' + "%"
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
