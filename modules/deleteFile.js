const fs = require("fs")

exports.deleteFile = async function (path) {
    fs.access(path, fs.constants.F_OK, (err) => { // A
        if (err) return console.log('삭제할 수 없는 파일입니다');

        fs.unlink(path, (err) => err ?
            console.log(err) : console.log(`${path} 를 정상적으로 삭제했습니다`));
    });
}