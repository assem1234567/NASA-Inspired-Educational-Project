const express =require('express');

const {
    httpGetAllplanets ,
} = require('./planets.controller');

const planetsRouters=express.Router();

planetsRouters.get('/',httpGetAllplanets);

module.exports =planetsRouters;