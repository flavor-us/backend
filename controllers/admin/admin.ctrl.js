const models = require("../../models");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

exports.getContents = async (req, res) => {
	var toFind;
	if (req.query.filename)
		toFind = "filename"
	else if (req.query.rekognition)
		toFind = "rekognition"
	try {
		const [contents] = await Promise.all([models.Contents.findAll({
			where: {
				[Op.and]: {
					rekognition: {
						[Op.like]: req.query.rekognition ? ("%" + req.query.rekognition + "%") : "%" + '' + "%"
					},
					filename: {
						[Op.like]: req.query.filename ? ("%" + req.query.filename + "%") : "%" + '' + "%"
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
