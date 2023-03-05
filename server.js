import express from 'express';
import cors from 'cors';

import { fetchMensa } from 'ka-mensa-fetch'

const app = express();

app.use(cors());

const port = process.env.NODE_PORT || 5000;

app.get('/', async (req, res) => {
    const date = req.query.date ? new Date(req.query.date) : new Date(); //Make request either given date or today
    await fetchMensa('simplesite', { canteens: ['moltke'], dates: [date] })
        .then(data => {
            console.log(data)
            res.send(data[0]);
        });``
});

app.get('/koeriStatus', async (req, res) => {
    const date = new Date();
    await fetchMensa('simplesite', { canteens: ['moltke'], dates: [date] })
        .then(data => {
            console.log(data)
            if (data.length == 0 || data[0].lines[6].meals.length === 0){
                return res.send(JSON.stringify({"koeriOpen" : false}));
            }
            res.send(JSON.stringify({"koeriOpen" : true}));
        });
});


app.listen(port, () => console.log(`Mensa API Server listening on port ${port}!`));