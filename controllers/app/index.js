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
 *  post:
 *   description: 인공지능으로 사진에 담겨있는 객체들의 정보를 판단하여 라벨링 데이터를 제공합니다.
 *   parameters:
 *   - in : "req.file"
 *     name : "file"
 *     description: 사진 파일
 *     required: true
 *   responses:
 *     '200':
 *      description: 성공적으로 rekogData를 반환한 경우입니다.
 *      schema: 
 *       $ref: '#/components/schemas/rekogData'
 *     '400':
 *      description: 사진 파일을 인식할 수 없는 경우입니다.
 *      schema: 
 *       $ref: '#/components/schemas/error'
 * /app/contents:
 *  post:
 *   description: 데이터베이스의 Contents 테이블에 Column을 Insert 합니다.
 *   parameters:
 *   - in: body
 *     name: contents
 *     description: contents 테이블에 삽입될 내용입니다.
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
 */
router.post("/name", upload.single("photo"), ctrl.getNames);
router.post("/rekog", upload.single("photo"), ctrl.getRekog);
router.post("/contents", ctrl.dbupload);
module.exports = router;
