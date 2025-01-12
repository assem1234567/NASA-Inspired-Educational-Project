const {
    getAlllaunches,
    existsLaunchWithId,
    aobrtLaunchById,
    scheduleNewLaunch,
} =require('../../models/launches.model');

async function httpGetAlllaunches(req,res)
{
    //console.log(launches.values);
    return res.status(200).json(await getAlllaunches());
}
async function httpAddnewlaunch(req,res)
{   
    const launch=req.body;
    if(!launch.mission||!launch.launchDate||!launch.target||!launch.rocket)
    {
        return res.status(400).json({error:'invalid data bitch'});
    }
    launch.launchDate=new Date(launch.launchDate);
    if(launch.launchDate.toString()=='Invalid Date')
    {
        return res.status(400).json({
            error:'fuck you the date is not valid',
        });
    }
    await scheduleNewLaunch(launch);
    console.log(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req,res)
{
    const launchId=Number(req.params.id);
    //if doesn'te exisi
    const existsLaunch= await existsLaunchWithId(launchId);
    if(!existsLaunch){
        return res.status(400).json({
            error:"fuck you i didn't found it bitch",
        });
     }
    //if found it
    const aborted = await aobrtLaunchById(launchId);
    
    console.log(`this is the aborted var ${aborted}`);
    if(!aborted)
    {
        return res.status(400).json({
            error: 'Launch not aborted',
        })
    }
    return res.status(200).json({
        ok:'true',
    });
}

module.exports={
    httpGetAlllaunches,
    httpAddnewlaunch,
    httpAbortLaunch,
};