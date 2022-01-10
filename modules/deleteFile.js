const fs = require("fs")
const logger = require("../../../config/logger");

exports.deleteFile = async function (path) {
    fs.access(path, fs.constants.F_OK, (err) => {
        if (err) return logger.error('삭제할 수 없는 파일입니다');

        fs.unlink(path, (err) => err ?
            logger.error(err) : logger.error(`${path} 를 정상적으로 삭제했습니다`));
    });
}