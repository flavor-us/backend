const jwt = require('jsonwebtoken');
const TOKEN_EXPIRED = -3;
const TOKEN_INVALID = -2;
const errorMsg = require("../message/error");

const jwtAuth = {
    checkToken: async (req, res, next) => {
        var token = req.headers.accesstoken;
        var user;
        // 토큰 없음
        if (!token)
            return res.status(400).send(errorMsg.invalidToken);
        // decode
        try {
            user = jwt.verify(token, process.env.JWT_TOKEN);
            // 유효기간 만료
            if (user === TOKEN_EXPIRED)
                return res.status(401).send(errorMsg.expiredToken);
            // 유효하지 않는 토큰
            if (user === TOKEN_INVALID || user.uuid) //refreshtoken 사용할 경우
                return res.status(401).send(errorMsg.invalidToken);
            if (user.kakao_id === undefined)
                return res.status(401).send(errorMsg.wrongToken);
            req.kakao_id = user.kakao_id;
        } catch (e) {
            res.status(400).send({ msg: e });
        }
        next();
    }
}

module.exports = jwtAuth;