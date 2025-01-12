const express=require('express');

const {
    httpGetAlllaunches,
    httpAddnewlaunch,
    httpAbortLaunch,
}=require('./launches.controller');

const launchesRouters=express.Router();

launchesRouters.get('/', httpGetAlllaunches);
launchesRouters.post('/',httpAddnewlaunch);
launchesRouters.delete('/:id',httpAbortLaunch);

module.exports= launchesRouters;