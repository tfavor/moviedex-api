const express = require('express');
const morgan = require('morgan');
const movies = require('./movies-data.json');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();


const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization')
    
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'unauthorized request'})
    }

    next()
})

function handleGetMovie(req, res) {
    let results = movies;

    if(req.query.genre) {
        results = results.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }

    if(req.query.country) {
        results = results.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }

    if(req.query.avg_vote) {
        results = results.filter(movie => 
            movie.avg_vote >= req.query.avg_vote)
    }

        res.json(results)
}

app.get('/movies', handleGetMovie)

const PORT =  8000;

app.listen(PORT, () => {
})