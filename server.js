import express from 'express';
import cors from 'cors';

import { fetchMensa } from 'ka-mensa-fetch'

const app = express();

app.use(cors());

const port = process.env.NODE_PORT || 3001;

app.get('/', async (req, res) => {
    const dateProvided = !!req.query.date;
    const today = new Date();
    const date = req.query.date ? req.query.date : 
        `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;

        await fetchMensa('simplesite', { canteens: ['moltke'], dates: [date] })
        .then(data => {
            let weekDay = new Date(date).getDay();

            if(weekDay == 0 || weekDay == 6) return res.send([]);

            let dataIndex = dateProvided ? calculateDataIndex(req.query.date) : 0;
            
            if(data[dataIndex]){
                res.send(data[dataIndex]);
            }else{
                res.send([])
            }
        });
});

app.get('/koeriStatus', async (req, res) => {
    const date = new Date();
    await fetchMensa('simplesite', { canteens: ['moltke'], dates: [date] })
        .then(data => {
            let weekDay = date.getDay();
            if(weekDay == 0 || weekDay == 6 || (data.length == 0)) return res.send(JSON.stringify({"koeriOpen" : false}));

            if(data[0]){
                let koeriStatus = data[0].lines[6].meals.length === 0 && data[0].lines[2].meals.length === 0;
                return res.send(JSON.stringify({"koeriOpen" : !koeriStatus}))
            }

            res.send(JSON.stringify({"koeriOpen" : false}));
        });
});


app.listen(port, () => console.log(`Mensa API Server listening on port ${port}!`));


function calculateDataIndex(dateString){
    const requestedDate = new Date(dateString);
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);

    let daysOfReqeustedDate = Math.floor((requestedDate - startDate) / (24 * 60 * 60 * 1000));
    let daysOfCurrentDate = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));

    const weekNumberRequested = Math.ceil(daysOfReqeustedDate / 7);
    const weekNumberCurrent = Math.ceil(daysOfCurrentDate / 7);

    if(weekNumberCurrent == weekNumberRequested){
        return requestedDate.getDay() - currentDate.getDay();
    }else{
        return requestedDate.getDay() - 1
    }
}