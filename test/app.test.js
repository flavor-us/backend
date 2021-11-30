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
                user_id: "1",
                filename: "file_jest",
                rekog: { jest: jest },
                restname: "jestrest",
                tagList: {
                    "tag_id": ["1", "2", "3"]
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
                followed_id: "2",
                follower_id: "3"
            })
            expect(response.statusCode).toBe(201);
        })
    })
    describe("given only followerId", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/relation").send({
                follower_id: "2"
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
        const user_uuid = "054bc6ee-779a-40c2-8aee-d686e159f7c5"//user_id = 45
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/feeds/" + user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /contents/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        const user_uuid = "054bc6ee-779a-40c2-8aee-d686e159f7c5";//user_id = 45
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/contents/" + user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /relation/follower/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        const user_uuid = "054bc6ee-779a-40c2-8aee-d686e159f7c5";//user_id = 45
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/relation/follower/" + user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /relation/follower/:user_uuid", () => {
    describe("올바른 user_UUID 제공", () => {
        const user_uuid = "054bc6ee-779a-40c2-8aee-d686e159f7c5";//user_id = 45
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/relation/follower/" + user_uuid).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("DELETE /relation/follower/:user_uuid/:delete_id", () => {
    describe("올바른 user_UUID 제공 45 -> 44 제거", () => {
        const user_uuid = "054bc6ee-779a-40c2-8aee-d686e159f7c5";//user_id = 45
        const delete_id = 44;
        test("should respond with statusCode 204", async () => {
            const response = await request(app).delete("/app/relation/follower/" + user_uuid + "/" + delete_id).send()
            expect(response.statusCode).toBe(204);
        })
    })
})
