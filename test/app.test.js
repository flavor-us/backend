const app = require('../app')
const request = require('supertest');
const mocking = require("../modules/mocking");
const models = require("../models");
const errorMsg = require("../message/error");

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


var id = {
    user: "",
    content: "",
    kakao: ""
};

beforeAll(async () => {
    var idList = await mocking.makeMock();
    id.user = idList.user;
    id.content = idList.content;
    id.kakao = idList.kakao;
    //mockData 생성
})

afterAll(async () => {
    await mocking.deleteMock();
    //Delete mockData & Test made Data
})

// USER
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
    describe("valid Value -> modify profile information successfully", () => {
        test("update successful", async () => {
            const response = await request(app).patch("/app/user/" + id.kakao).send({
                username: "jest",
                profileimg_path: "/testpath"
            })
            expect(response.statusCode).toBe(201);
        })
        describe("same value -> not updated", () => {
            test("updated Fail", async () => {
                const response = await request(app).patch("/app/user/" + id.kakao).send({
                    username: "jest",
                    profileimg_path: "/testpath"
                })
                expect(response.body).toEqual(errorMsg.updateFail);
                expect(response.statusCode).toBe(400);
            })
        })
    })
})

// CONTENTS
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

describe("admin Contents", () => {
    describe("normal test", () => {
        test("should respond", async () => {
            const response = await request(app).get("/admin/contents");
            expect(response).not.toBeNull()
        })
    })
})

describe("GET /contents/relevant/:kakao_id", () => {
    describe("given valid kakao_id", () => {
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/contents/relevant/" + id.kakao).send()
            expect(response.statusCode).toBe(200);
        })
    })
    describe("given invalid kakao_id", () => {
        test("should respond with statusCode 400", async () => {
            const response = await request(app).get("/app/contents/relevant/" + 0).send()
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(errorMsg.noUser);
        })
    })
})

describe("GET /contents/:kakao_id", () => {
    describe("given valid kakao_id", () => {
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/contents/" + id.kakao).send()
            expect(response.statusCode).toBe(200);
        })
    })
    describe("given invalid kakao_id", () => {
        test("should respond with statusCode 400", async () => {
            const response = await request(app).get("/app/contents/" + 0).send()
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(errorMsg.noUser);
        })
    })
})

describe("PATCH /contents/:content_id", () => {
    describe("valid value -> contents update successfully", () => {
        test("update Successful", async () => {
            const response = await request(app).patch("/app/contents/" + id.content).send({
                adj1_id: 2,
                adj2_id: 1,
                locationtag_id: 1
            })
            expect(response.statusCode).toBe(201);
        })
    })
    describe("same value -> update fail", () => {
        test("수정 불가", async () => {
            const response = await request(app).patch("/app/contents/" + id.content).send({
                adj1_id: 2,
                adj2_id: 1,
                locationtag_id: 1
            })
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(errorMsg.updateFail);
        })
    })
})

//RELATION
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

describe("GET /relation/follower/:kakao_id", () => {
    describe("given valid kakao_id", () => {
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/relation/follower/" + id.kakao).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("GET /relation/follower/:kakao_id", () => {
    describe("given valid kakao_id", () => {
        test("should respond with statusCode 200", async () => {
            const response = await request(app).get("/app/relation/follower/" + id.kakao).send()
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("DELETE /relation/follower/:kakao_id/:delete_id", () => {
    describe("given valid kakao_id", () => {
        const delete_id = 1;
        test("should respond with statusCode 204", async () => {
            const response = await request(app).delete("/app/relation/follower/" + id.kakao + "/" + delete_id).send()
            expect(response.statusCode).toBe(204);
        })
    })
})

//APPOINTMENT
describe("POST /appointment", () => {
    describe("valid value -> make appointment", () => {
        test("upload successfully", async () => {
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
    describe("valid value -> read appointment list successfully", () => {
        test("정상 GET", async () => {
            const response = await request(app).get("/app/appointment").send({
                user_id: id.user
            })
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("DELETE /appointment", () => {
    describe("valid value -> remove appointment list", () => {
        test("정상 GET", async () => {
            const response = await request(app).delete("/app/appointment").send({
                user_id: id.user
            })
            expect(response.statusCode).toBe(204);
        })
    })
})

