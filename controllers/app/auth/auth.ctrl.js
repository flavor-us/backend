const models = require("../../../models");
const kakaoAuth = require('../../../modules/kakaoAuth');
require("dotenv").config();

exports.login = async (req, res) => {
    try {
        let userEmail = "";
        let userNickName = "";
        if (req.body.access_token) {
            //초기 로그인
            const result = await kakaoAuth.getProfile(req.body.access_token);
            const kakaoUser = JSON.parse(result).kakao_account;
            userEmail = kakaoUser.email;
            userNickName = kakaoUser.profile.nickname;
        } else {
            //자동 로그인
            const user = jwt.verify(req.headers.authorization, process.env.JWT_SECRET, {
                ignoreExpiration: true,
            });
            userEmail = user.email;
        }

        const [user, created] = await models.User.findOrCreate({
            where: { email: userEmail },
            defaults: {
                username: userNickName,
                kakaotoken: req.body.access_token
            },
            attributes: ['id', 'username'],
        });

        let responseData = {
            success: true,
            user,
        };

        if (req.body.access_token) {
            const token = jwt.sign({
                id: user.id,
                email: userEmail,
            }, process.env.JWT_TOKEN, {
                issuer: 'limchanyeop',
            });
            responseData.jwt = token;
        }
        return res.status(created ? 201 : 200).json(responseData);
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.toString(),
        });
    }
};