const PORT= process.env.PORT||8000;
const http=require('http');
const app=require('./app');
const {loadPlanetsData} = require('./models/planets.models');
const server=http.createServer(app);

const {mongoConnect}=require('./serveices/mongo');

async function startServer(){
    try{
        await mongoConnect();
        await loadPlanetsData();
        server.listen(PORT,()=>{
            console.log(`i am listing bitch on port ${PORT} ...`);
        });
    }
    catch(err)
    {
        console.error('Error starting the server:', err);
    }
}

startServer();
// ....