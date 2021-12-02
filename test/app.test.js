const app = require('../app')
const request = require('supertest');

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

describe("POST /user", () => {
    describe("given a username & email", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/user").send({
                username: "jesttest1",
                email: "jest@jest.com"
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

describe("POST /content", () => {
    describe("given full requirement, include tagList", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/contents").send({
                user: 1,
                rest: 10000,
                filename: "file_jest",
                rekog: { Labels: { "jest": "jest" } },
                restname: "jestrest",
                tagList: {
                    "tag_id": [1, 2, 3]
                }

            })
            expect(response.statusCode).toBe(201);
        })
    })
})

describe("POST /relation", () => {
    describe("given full requirement", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/relation").send({
                followed_id: 2,
                follower_id: 3
            })
            expect(response.statusCode).toBe(201);
        })
    })
    describe("given only followerId", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/relation").send({
                follower_id: 2
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

describe("GET /feeds/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        const user_uuid = "43cdeffc-936f-426c-801f-515bf759f8ba"//user_id = 45
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/feeds/" + user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /contents/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        const user_uuid = "43cdeffc-936f-426c-801f-515bf759f8ba";//user_id = 45
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/contents/" + user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /relation/follower/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        const user_uuid = "43cdeffc-936f-426c-801f-515bf759f8ba";//user_id = 45
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/relation/follower/" + user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /relation/follower/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        const user_uuid = "43cdeffc-936f-426c-801f-515bf759f8ba";//user_id = 45
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/relation/follower/" + user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("DELETE /relation/follower/:user_uuid/:delete_id", () => {
    describe("올바른 user_UUID 제공 45 -> 44 제거", () => {
        const user_uuid = "43cdeffc-936f-426c-801f-515bf759f8ba";//user_id = 45
        const delete_id = 44;
        test("should respond with statusCode 204", async () => {
            const response = await request(app).delete("/app/relation/follower/" + user_uuid + "/" + delete_id).send()
            expect(response.statusCode).toBe(204);
        })
    })
})

describe("PUT /contents/:content_id", () => {
    describe("올바른 value 제공 -> 컨텐츠 수정", () => {
        test("예상 반환 값", async () => {
            const content_id = 2;
            const response = await request(app).put("/app/contents/" + content_id).send({
                "tagList": {
                    "tag_id": [1, 2, 4]
                }
            })
            expect(response.statusCode).toBe(201);
        })
    })
})

