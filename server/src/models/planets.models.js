const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse');

const planets=require('./planets.mongo');


function isHabitablePlanet(planet) {
  return planet['koi_disposition'] == 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData(){
    return new Promise((resolve, reject)=> {
        // fs.createReadStream('./../../data/kepler_data.csv')
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#',
            columns: true,
            //skip_empty_lines: true,
            //quote: '"',
            //escape: '"',
            relax_quotes: true,
            relax_column_count: true, // Allow rows with different column counts
            // on_record: (record, context) => {
            //     // // If record has the wrong number of columns, skip it
            //     // if (record.length !== 49) {
            //     //     //console.warn(`Skipping malformed record on line ${record.length}:`, record);
            //     //     //return null; // Skip malformed record
            //     // }
            //     return record;
            // }
        }))
        .on('data',async (data) => {
            //console.log(data);
            if (isHabitablePlanet(data)) {
                savePlanet(data);
                //console.log(`${data}`);
            }
        })
        .on('error', (err) => {
            //console.log(err);
            reject(err);
        })
        .on('end', async () => {
            //to print the names in console log
            // console.log(habitablePlanets.map((planet) => {
            //     return planet['kepler_name'];
            //     }));
            // to print the length in the console log
            const countPlanetsFound = (await getAllplanets()).length;
            console.log(`${countPlanetsFound} habitable planets found!`);
            resolve();  
        });
    });
}
async function getAllplanets()
{
    return await planets.find({},{
        '_id':0,'__v':0,
    });
}
async function savePlanet(planet)
{
    try {
        // تحديث أو إضافة الكوكب بناءً على وجوده في قاعدة البيانات
        await planets.updateOne(
            { keplerName: planet.kepler_name }, // شرط البحث
            { keplerName: planet.kepler_name }, // البيانات المراد إضافتها أو تحديثها
            { upsert: true } // تعيين upsert
        );
    } catch (err) {
        console.error(`Could not save the planet: ${err}`);
    }
}
module.exports={
    loadPlanetsData,
    getAllplanets,
};