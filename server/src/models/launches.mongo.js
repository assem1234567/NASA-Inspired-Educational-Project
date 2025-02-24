const mongoose=require('mongoose');
const { type } = require('os');

const launchesSchema=new mongoose.Schema({
    flightNumber:{
        type:Number,
        required:true,
    },
    mission: {
        type:String,
        required:true,
    },
    rocket: {
        type:String,
        required:true,
    },
    launchDate: {
        type:Date,
        required:true,  
    },
    target: {
        type:String,
        required:true,
    },
    customers: [String],
    upcoming:{
        type:Boolean,
        required:true,
    },
    success:{
        type:Boolean,
        required:true,
    },
});


// Connects launchesSchema with the "launches" collection
module.exports=mongoose.model('Launch', launchesSchema);