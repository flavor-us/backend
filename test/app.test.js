const app = require('../app')
const request = require('supertest');
const mocking = require("../modules/mocking");
const models = require("../models");
const errorMsg = require("../message/error");
const stationModule = require("../modules/nearStation");

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
    describe("given a full requirement", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/user").send({
                username: "jest",
                email: "jest@jest.com",
                kakaotoken: "testtoken",
                kakao_id: id.kakao + 1 // prevent duplication
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
    describe("duplicated entry", () => {
        test("should respond with a 400 status", async () => {
            const response = await request(app).post("/app/user").send({
                username: "jest",
                email: "jest@jest.com",
                kakaotoken: "testtoken",
                kakao_id: id.kakao + 1 // prevent duplication
            })
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(errorMsg.duplicatedEntry);
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

describe("GET /user", () => {
    describe("valid Value -> get profile information successfully", () => {
        test("get profile successfully", async () => {
            const response = await request(app).get("/app/user/" + id.kakao).send({});
            expect(response.statusCode).toBe(200);
            expect(response.body.username).not.toBeNull();
        })
        describe("get unposted user", () => {
            test("read Fail", async () => {
                const response = await request(app).get("/app/user/" + -1).send({});
                expect(response.statusCode).toBe(400);
                expect(response.body).toEqual(errorMsg.noUser);
            })
        })
    })
})

// CONTENTS
describe("POST /content", () => {
    describe("given full requirement, include tag", () => {
        test("should respond with a status 201", async () => {
            const response = await request(app).post("/app/contents").send({
                kakao_id: id.kakao,
                rest_id: 10000,
                filename: "jest",
                rekog: { Labels: { "jest": "jest" } },
                restname: "jestrest",
                adj1_id: 1,
                adj2_id: 1,
                locationtag_id: 1,
                lat: 37.54001365,
                lng: 127.0680031
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

describe("delete Contents", () => {
    describe("given correct contents", () => {
        test("should respond status 204", async () => {
            const response = await request(app).get("/app/contents/" + id.content);
            expect(response.statusCode).toBe(204);
        })
    })
})


// describe("GET /contents/:kakao_id", () => {
//     describe("given valid kakao_id", () => {
//         test("should respond with statusCode 200", async () => {
//             const response = await request(app).get("/app/contents/" + id.kakao).send()
//             expect(response.statusCode).toBe(200);
//         })
//     })
//     describe("given invalid kakao_id", () => {
//         test("should respond with statusCode 400", async () => {
//             const response = await request(app).get("/app/contents/" + 0).send()
//             expect(response.statusCode).toBe(400);
//             expect(response.body).toEqual(errorMsg.noUser);
//         })
//     })
// })

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
                followed_id: id.kakao,
                follower_id: id.kakao + 1// made by adduser test code
            })
            expect(response.statusCode).toBe(201);
        })
    })
    describe("given only followerId", () => {
        test("should respond with a status 400", async () => {
            const response = await request(app).post("/app/relation").send({
                follower_id: id.kakao
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

//Appointments
describe("POST /Appointments", () => {
    describe("valid value -> make Appointments", () => {
        test("upload successfully", async () => {
            const response = await request(app).post("/app/appointments").send({
                request: id.kakao + 1,//made by addUser test code
                requested: id.kakao,
                restname: "약속의 식당"
            })
            expect(response.statusCode).toBe(201);
        })
    })
    describe("duplicated appointment", () => {
        test("upload fail", async () => {
            const response = await request(app).post("/app/appointments").send({
                request: id.kakao + 1,//made by addUser test code
                requested: id.kakao,
                restname: "약속의 식당"
            })
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(errorMsg.duplicatedEntry);
        })
    })
    describe("not Enough requirement", () => {
        test("upload fail", async () => {
            const response = await request(app).post("/app/appointments").send({
                request: id.kakao + 1,//made by addUser test code
                restname: "약속의 식당"
            })
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(errorMsg.notEnoughReq);
        })
    })

})

describe("GET /Appointments", () => {
    describe("valid value -> read Appointments list successfully", () => {
        test("정상 GET", async () => {
            const response = await request(app).get("/app/appointments/" + id.kakao).send({})
            expect(response.statusCode).toBe(200);
        })
    })
})

describe("DELETE /Appointments", () => {
    describe("valid value -> remove Appointments list", () => {
        test("정상 DELETE", async () => {
            const response = await request(app).delete("/app/appointments/" + id.kakao).send({})
            expect(response.statusCode).toBe(204);
        })
    })
})

//user_id
describe("GET /userid/{kakao_id}", () => {
    describe("valid kakao_id -> get user_id", () => {
        test("정상 GET", async () => {
            const response = await request(app).get("/app/userid/" + id.kakao).send({});
            expect(response.statusCode).toBe(200);
        })
    })
    describe("invalid kakao_id -> get user_id", () => {
        test("GET 불가", async () => {
            const response = await request(app).get("/app/userid/" + 0).send({});
            expect(response.statusCode).toBe(400);
        })
    })
})

//user_id
describe("GET /uuid/{kakao_id}", () => {
    describe("valid user_id -> get uuid", () => {
        test("정상 GET", async () => {
            const response = await request(app).get("/app/uuid/" + id.user).send({});
            expect(response.statusCode).toBe(200);
        })
    })
    describe("invalid kakao_id -> get uuid", () => {
        test("GET 불가", async () => {
            const response = await request(app).get("/app/uuid/" + 0).send({});
            expect(response.statusCode).toBe(400);
        })
    })
})

//station
describe("MODULE TEST : Station Module", () => {
    describe("get valid Near station", () => {
        test("정상 요청", async () => {
            const response = await stationModule.getNearStation(37.54633909000000000, 127.07005690000000000);
            expect(response).not.toBeNull();
        })
    })
})


//restaurants
describe("get near restaurants API", () => {
    describe("valid lat, lng", () => {
        test("정상 요청", async () => {
            const response = await request(app).get("/app/near?lat=37.54652332&lng=126.79348611").send({});
            expect(response.statusCode).toBe(200);
        })
    })
    describe("only lat", () => {
        test("경도 쿼리 X", async () => {
            const response = await request(app).get("/app/near?lat=37.54652332").send({});
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(errorMsg.notEnoughReq);
        })
    })
    describe("lat, lng == null", () => {
        test("null string", async () => {
            const response = await request(app).get("/app/near?lat=null&lng=null").send({});
            expect(response.statusCode).toBe(400);
            expect(response.body).toEqual(errorMsg.notEnoughReq);
        })
    })
})

//tag
describe("GET /tag/adj1", () => {
    describe("get first adj tags", () => {
        test("정상 GET", async () => {
            const response = await request(app).get("/app/tag/adj1").send({});
            expect(response.statusCode).toBe(200);
            expect(response.body).not.toBeNull();
        })
    })
    describe("get second adj tags", () => {
        test("정상 GET", async () => {
            const response = await request(app).get("/app/tag/adj1").send({});
            expect(response.statusCode).toBe(200);
            expect(response.body).not.toBeNull();
        })
    })
    describe("get location tags", () => {
        test("정상 GET", async () => {
            const response = await request(app).get("/app/tag/locationtag").send({});
            expect(response.statusCode).toBe(200);
            expect(response.body).not.toBeNull();
        })
    })
})

