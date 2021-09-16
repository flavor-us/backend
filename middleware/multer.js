const path = require('path')
const uploadDir = path.join(__dirname , '../uploads');

const multer = require('multer');
const storage = multer.diskStorage({
	destination : (req, file, callback) => {
		callback(null, uploadDir);
	},
	filename : (req, file, callback) => {
		callback(null, 'foods-' + Date.now() + '.' + file.mimetype.split('/')[1]);
		// callback(null, 'foods' + '.' + file.mimetype.split('/')[1] );
	}
});

module.exports = multer({ storage });