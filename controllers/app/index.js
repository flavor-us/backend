const { Router } = require("express");
const router = Router();
const ctrl = require("./app.ctrl");
const upload = require("../../middleware/multer");

// Controllers
/**
 * @swagger
 * /app/name:
 *  post:
 *   description: 사진의 위치정보 근처에 있는 식당의 이름들을 json array로 받아올 수 있습니다.
 *   parameters:
 *   - in : "req.file"
 *     name : "file"
 *     description: EXIF 위도 경도 데이터가 담긴 사진 파일
 *     required: true
 *   responses:
 *     '200':
 *      description: 성공적으로 restData를 반환한 경우입니다.
 *      schema: 
 *       $ref: '#/components/schemas/restData'
 *     '400':
 *      description: 사진 파일이 없거나 사진에 EXIF 위치 데이터가 없는 경우입니다.
 *      schema: 
 *       $ref: '#/components/schemas/error'
 * /app/rekog:
 *  get:
 *   description: 인공지능으로 사진에 담겨있는 객체들의 정보를 판단하여 라벨링 데이터를 제공합니다.
 *   parameters:
 *   - in : "req.query"
 *     name : s3ImageKey
 *     description: s3 버킷에 올라가 있는 이미지 파일명 (쿼리 예시 -> /app/rekog?s3ImageKey=filename.jpeg)
 *     required: true
 *   responses:
 *     '200':
 *      description: 성공적으로 rekogData를 반환한 경우입니다.
 *      schema: 
 *       $ref: '#/components/schemas/rekogData'
 *     '400':
 *      description: s3버킷에서 이미지를 찾을 수 없는 경우입니다.
 *      schema:
 *       properties:
 *        msg:
 *         type: string
 *         description: 에러메시지
 *       example:
 *        msg: "s3버킷에서 이미지 정보를 추출할 수 없습니다"
 * /app/s3/{user_id}:
 *  post:
 *   description: s3 버킷에 이미지를 업로드합니다. 인공지능 인식 결과(rekogData)를 얻기 위한 필수 절차입니다. 
 *   parameters:
 *   - in: params
 *     name: id
 *     description: 사용자 아이디 (param 예시 app/s3/1)
 *     required: true
 *   responses:
 *     '201':
 *      description: 성공적으로 s3에 사진이 업로드 된 경우입니다.
 *      schema:
 *       $ref: '#/components/schemas/s3upload_response'
 *     '400':
 *      description: s3버킷에 이미지를 업로드하지 못한 경우입니다.
 *      schema:
 *       properties:
 *        msg:
 *         type: string
 *         description: 에러메시지
 *       example:
 *        msg: "s3 버킷에 업로드 할 수 없습니다."
 * /app/contents:
 *  post:
 *   description: 데이터베이스의 Contents 테이블에 Column을 Insert 합니다.
 *   parameters:
 *   - in: body
 *     name: contents
 *     description: contents 테이블에 삽입될 내용입니다.
 *     required: true
 *     schema:
 *      $ref: '#/components/schemas/dbupload_request'
 *   responses:
 *     '201':
 *      description: Contents 테이블에 Column을 성공적으로 추가한 경우입니다.
 *      schema: 
 *       $ref: '#/components/schemas/dbupload_complete'
 *     '400':
 *      description: 제약 조건을 지키지 못해 Contents 를 업로드 하지 못한 경우입니다.
 *      schema: 
 *       $ref: '#/components/schemas/dbupload_fail'
 * /app/contents/{content_id}:
 *  delete:
 *   description: 데이터베이스의 Contents 테이블에 Column을 Delete 합니다.
 *   parameters:
 *   - in: params
 *     name: content_id
 *     description: Contents 테이블에서 삭제할 Content의 id 입니다.
 *     required: true
 *   responses:
 *     '204':
 *      description: Contents 테이블에 Column을 성공적으로 제거한 경우입니다.
 *      schema: 
 *       properties:
 *        msg:
 *         type: string
 *         description: 성공 메시지
 *        deletedId:
 *         type: integer
 *         description: 제거된 Content의 아이디
 *       example:
 *        msg: "Content를 성공적으로 지웠습니다."
 *        deletedId: 42
 *     '400':
 *      description: 제약 조건을 지키지 못해 Content를 제거 하지 못한 경우입니다.
 *      schema: 
 *       properties:
 *        msg:
 *         type: string
 *         description: 에러 메시지
 *       example:
 *        msg: "Content를 지우지 못했습니다."
 * /app/user:
 *  post:
 *   description: 데이터베이스의 User 테이블에 Column을 Insert 합니다.
 *   parameters:
 *   - in: body
 *     name: user
 *     description: User 테이블에 삽입될 내용입니다.
 *     required: true
 *     schema:
 *      properties:
 *       email:
 *        type: string
 *        description: 이메일
 *       username:
 *        type: string
 *        description: 유저 이름
 *      example:
 *        email : "example@naver.com"
 *        username: "example"
 *   responses:
 *     '204':
 *      description: User 테이블에 Column을 성공적으로 추가한 경우입니다.
 *      schema: 
 *       properties:
 *        msg:
 *         type: string
 *         description: 성공 메시지
 *        userId:
 *         type: string
 *         description: 추가된 유저의 id
 *       example:
 *        msg: "User를 성공적으로 업로드했습니다."
 *        userId: "42"
 *     '400':
 *      description: 제약 조건을 지키지 못해 user를 업로드 하지 못한 경우입니다.
 *      schema: 
 *       properties:
 *        msg:
 *         type: string
 *         description: 에러 메시지
 *       example:
 *        msg: "User를 업로드 하지 못했습니다." 
 * /app/user/{user_id}:
 *  delete:
 *   description: 데이터베이스의 User 테이블에 Column을 Delete 합니다.
 *   parameters:
 *   - in: params
 *     name: user_id
 *     description: User 테이블에서 삭제할 user의 id 입니다.
 *     required: true
 *   responses:
 *     '204':
 *      description: User 테이블에 Column을 성공적으로 제거한 경우입니다.
 *      schema: 
 *       properties:
 *        msg:
 *         type: string
 *         description: 성공 메시지
 *        userId:
 *         type: integer
 *         description: 제거된 User의 아이디
 *       example:
 *        msg: "user를 성공적으로 지웠습니다."
 *        userId: 42
 *     '400':
 *      description: 제약 조건을 지키지 못해 user를 제거 하지 못한 경우입니다.
 *      schema: 
 *       properties:
 *        msg:
 *         type: string
 *         description: 에러 메시지
 *       example:
 *        msg: "user를 지우지 못했습니다."
 * /app/relation:
 *  post:
 *   description: 데이터베이스의 User 테이블에 Column을 Delete 합니다.
 *   parameters:
 *   - in: body
 *     followingId: 팔로잉 아이디 (친구 신청을 하는 유저)
 *     followedId: 팔로워 아이디 (친구 신청을 받는 유저)
 *     required: true
 *   responses:
 *     '201':
 *      description: Relation 테이블에 Column을 성공적으로 추가한 경우입니다.
 *      schema: 
 *       properties:
 *        msg:
 *         type: string
 *         description: 성공 메시지
 *       example:
 *        msg: "요청을 성공적으로 추가했습니다."
 *     '400':
 *      description: 제약 조건을 지키지 못해 relation을 추가하지 못했습니다.
 *      schema: 
 *       properties:
 *        msg:
 *         type: string
 *         description: 에러 메시지
 *       example:
 *        msg: "필수 requirement가 충족되지 못했습니다. api를 다시 확인해주세요"
 */
router.post("/name", upload.single("photo"), ctrl.getNames);

router.delete("/contents/:content_id", ctrl.deleteContents);
router.get("/contents/:user_uuid", ctrl.getMyContents); //added
router.post("/contents", ctrl.uploadContents);

router.delete("/user/:user_id", ctrl.deleteUser);
router.post("/user", ctrl.addUser);

router.post("/s3/:user_id", upload.single("photo"), ctrl.s3Upload);
router.get("/rekog", ctrl.getRekog);

router.delete("/relation/following/:user_uuid/:delete_id", ctrl.deleteFollowing)
router.get("/relation/follower/:user_uuid", ctrl.getFollower);
router.get("/relation/following/:user_uuid", ctrl.getFollowing)
router.post("/relation", ctrl.makeRelation);

router.get("/feeds/:user_uuid", ctrl.getFeedsContents); //added


module.exports = router;
