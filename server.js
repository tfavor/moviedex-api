const express = require('express');
const morgan = require('morgan');
const movies = require('./movies-data.json');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use(morgan('dev'))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    console.log('validate bearer token middleware')

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
        results = movies.filter(movie => 
            movie.genre.toLowerCase().includes(req.query.genre.toLowerCase()))
    }

    if(req.query.country) {
        results = movies.filter(movie =>
            movie.country.toLowerCase().includes(req.query.country.toLowerCase()))
    }

    if(req.query.avg_vote) {
        results = movies.filter(movie => 
            movie.avg_vote >= req.query.avg_vote)
    }

        res.json(results)
}

app.get('/movies', handleGetMovie)

app.listen(8000, () => {
    console.log('Server listening on PORT 8000');
})