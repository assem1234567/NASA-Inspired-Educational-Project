const { throwDeprecation } = require('process');
const launchesDatabase = require('./launches.mongo');

const planetsDatabase = require('./planets.mongo');
// const { throws } = require('assert');

const DEFAULT_FLIGHT_NUMBER=10;

const launches=new Map();

const launch ={
    flightNumber:10,
    mission: 'exploring the moon',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 1,2024'),
    target: 'Kepler-452 b',
    customers: ['assem','ayham'],
    upcoming:true,
    success:true,
};

saveLaunches(launch);

launches.set(launch.flightNumber,launch);
 
async function existsLaunchWithId(launchId)
{   
    return await launchesDatabase.find({
        flightNumber:launchId,
    });   
}
 
async function getLatestFlightNumber()
{
    const latestLaunch= await launchesDatabase
    .findOne()
    .sort('-flightNumber');
    if(!latestLaunch)return DEFAULT_FLIGHT_NUMBER;
     
    return latestLaunch.flightNumber;
}

async function getAlllaunches()
{
    return await launchesDatabase
    .find({},{'_id':0,'__v':0});
    // return Array.from(launches.values());
}

async function saveLaunches(launch) {

        const planet = await planetsDatabase.findOne({
            keplerName: launch.target,
        });

        console.log('Queried Planet:', planet);

        if (!planet) {
            return;
            // throw new Error('planet not found');
        }        
        await launchesDatabase.findOneAndUpdate (
            { flightNumber: launch.flightNumber },
            launch,
            { upsert: true }
        );
}   

async function scheduleNewLaunch(launch)
{
    const newFlightNumber = 1+ await getLatestFlightNumber();
    const newLaunch=Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:['ayham','assem'],
        flightNumber: newFlightNumber,
    });
    await saveLaunches(launch);
}
 
async function aobrtLaunchById(launchId)
{
    const aborted = await launchesDatabase.updateOne({
        flightNumber:launchId,
    },{
        upcoming:false,
        success:false,
    });
    return aborted.acknowledged===true&&aborted.matchedCount===1;
}
module.exports ={
    existsLaunchWithId,
    getAlllaunches,
    scheduleNewLaunch,
    aobrtLaunchById,
};