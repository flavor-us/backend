const app = require('../app')
const request = require('supertest');
const mocking = require("../modules/mocking");
const uuidConvert = require("../modules/uuidConvert")
// describe("URL", () => {
//     describe("조건", () => {
//         test("예상 반환 값", async () => {
//             const response = await request(app).post("url").send({
//                 key: values,
//             })
//             expect(response).toBe();
//         })
//     })
// })

const id = beforeAll(() => {
    const id = await mocking.makeMock();
    id.user_uuid = await uuidConvert.getIdFromUuid(id.user);
    return id;
    //mockData 생성
})
afterAll(() => {
    await mocking.deleteMock();
    //Delete mockData & Test made Data
})


describe("POST /user", () => {
    describe("given a username & email", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/user").send({
                username: "jest",
                email: "jest@jest.com",
                kakaotoken: "testtoken"
            })
            expect(response.statusCode).toBe(201);
        })
    })
    describe("given only one requirement", () => {
        test("should respond with a 400 status", async () => {
            const response = await request(app).post("/app/user").send({
                username: "jesttest_withoutEmail"
            })
            expect(response.statusCode).toBe(400);
        })
    })
})

describe("PATCH /user", () => {
    describe("올바른 값 -> 프로필 정보 수정", () => {
        test("정상 수정", async () => {
            const response = await request(app).patch("/app/user").send({
                user_id: id.user,
                username: "jest",
                profileImgPath: "/test"
            })
            expect(response.statusCode).toBe(201);
        })
    })
})

describe("POST /content", () => {
    describe("given full requirement, include tag", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/contents").send({
                user_id: 1,
                rest_id: 10000,
                filename: "jest",
                rekog: { Labels: { "jest": "jest" } },
                restname: "jestrest",
                adj1_id: 1,
                adj2_id: 1,
                locationtag_id: 1,
                lat: 127.1,
                lng: 37.1
            })
            expect(response.statusCode).toBe(201);
        })
    })
})

describe("POST /relation", () => {
    describe("given full requirement", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/relation").send({
                followed_id: 1,
                follower_id: id.user
            })
            expect(response.statusCode).toBe(201);
        })
    })
    describe("given only followerId", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/relation").send({
                follower_id: id.user
            })
            expect(response.statusCode).toBe(400);
        })
    })
})

describe("admin Contents 테이블", () => {
    describe("normal test", () => {
        test("should respond something", async () => {
            const response = await request(app).get("/admin/contents");
            expect(response).not.toBeNull()
        })
    })
})

describe("GET /contents/relevant/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/contents/relevant/" + id.user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /contents/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/contents/" + id.user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /relation/follower/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/relation/follower/" + id.user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /relation/follower/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/relation/follower/" + id.user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("DELETE /relation/follower/:user_uuid/:delete_id", () => {
    describe("올바른 user_UUID 제공 1 -> 44 제거", () => {
        const delete_id = 1;
        test("should respond with statusCode 204", async () => {
            const response = await request(app).delete("/app/relation/follower/" + id.user_uuid + "/" + delete_id).send()
            expect(response.statusCode).toBe(204);
        })
    })
})

describe("PUT /contents/:content_id", () => {
    describe("올바른 value 제공 -> 컨텐츠 수정", () => {
        test("정상 수정", async () => {
            const content_id = 2;
            const response = await request(app).put("/app/contents/" + content_id).send({
                adj1_id: 1,
                adj2_id: 1,
                locationtag_id: 1
            })
            expect(response.statusCode).toBe(201);
        })
    })
})


describe("POST /appointment", () => {
    describe("올바른 값 -> 약속 생성", () => {
        test("정상 업로드", async () => {
            const response = await request(app).post("/app/appointment").send({
                request: 1,
                requested: id.user,
                restname: "약속의 식당"
            })
            expect(response.statusCode).toBe(201);
        })
    })
})

describe("GET /appointment", () => {
    describe("올바른 값 ->약속 신청 읽어오기", () => {
        test("정상 GET", async () => {
            const response = await request(app).get("/app/appointment").send({
                user_id: id.user
            })
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("DELETE /appointment", () => {
    describe("올바른 값 ->약속 리스트 제거", () => {
        test("정상 GET", async () => {
            const response = await request(app).delete("/app/appointment").send({
                user_id: id.user
            })
            expect(response.statusCode).toBe(204);
        })
    })
})

