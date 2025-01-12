const request=require('supertest');
const app=require('../../app');
const {
    mongoConnect,
    mongoDisconnect,
}=require('../../serveices/mongo');

describe('Launches API',()=>{
    beforeAll(async ()=>{
        await mongoConnect();
    });
    afterAll(async ()=>{
        await mongoDisconnect();
    });
    
describe('Test GET /launches',()=>{
    test('It should response with 200 success',async ()=>{
        const response= await request(app)
        .get('/launches')
        .expect(200)
        .expect('Content-Type',/json/);
    });
});


describe('Test POST /launch',()=>{

    
        const completedLaunchDate={
            mission:'any thing to write',
            rocket:'na;lkajd',
            target:'ketpler-62 f',
            launchDate:'January 4, 2028',
        };
        const launchDatawithoutdate={
            mission:'any thing to write',
            rocket:'na;lkajd',
            target:'ketpler-62 f',
        };
        const launchDataWithInvalidDate={
            mission:'any thing to write',
            rocket:'na;lkajd',
            target:'ketpler-62 f',
            launchDate:'Jaasd',
        }
        test('It should response with 201 created',async()=>{
            const response= await request(app)
            .post('/launches')
            .send(completedLaunchDate)
            .expect(201)
            .expect('Content-Type',/json/);
            const requestDate=new Date(completedLaunchDate.launchDate).valueOf();
            const responseDate=new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);

            expect(response.body).toMatchObject(launchDatawithoutdate);
        });
        test('It should catch missing required properties',async ()=>{
            const response = await request(app)
            .post('/launches')
            .send(launchDatawithoutdate)
            .expect(400)
            .expect('Content-Type',/json/);
            expect(response.body).toStrictEqual({
                error:'invalid data bitch',
            });
        });
        test('It should catch invalid dates',async ()=>{
            const response = await request(app)
            .post('/launches')
            .send(launchDataWithInvalidDate)
            .expect(400)
            .expect('Content-Type',/json/);
            expect(response.body).toStrictEqual({
                error:'fuck you the date is not valid',
            });
        });
    });
})