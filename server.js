import express from 'express';
import cors from 'cors';

import { fetchMensa } from 'ka-mensa-fetch'

const app = express();

app.use(cors());

const port = process.env.NODE_PORT || 3001;

app.get('/', async (req, res) => {
    const today = new Date();
    const date = req.query.date ? req.query.date : 
        `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;

        await fetchMensa('simplesite', { canteens: ['moltke'], dates: [date] })
        .then(data => {
            let weekDay = new Date(date).getDay();
            if(weekDay == 0 || weekDay == 6) return res.send([]);

            if(data[weekDay - 1]){
                res.send(data[weekDay - 1]);
            }else{
                res.send([])
            }
        });
});

app.get('/koeriStatus', async (req, res) => {
    const date = new Date();
    await fetchMensa('simplesite', { canteens: ['moltke'], dates: [date] })
        .then(data => {
            if (data.length == 0 || data[0].lines[6].meals.length === 0){
                return res.send(JSON.stringify({"koeriOpen" : false}));
            }
            res.send(JSON.stringify({"koeriOpen" : true}));
        });
});


app.listen(port, () => console.log(`Mensa API Server listening on port ${port}!`));