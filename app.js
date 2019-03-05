const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt')
const faker = require('faker');

const config = require('./config');
console.log(config);
const mongoose = require('mongoose');


mongoose.connect(`mongodb+srv://${config.db.user}:${config.db.password}@cluster0-1tudq.mongodb.net/expressmovie`, { useNewUrlParser: true })
    .then(() => console.log("Database OK"))
    .catch(err => console.log(err))

const movieSchema = mongoose.Schema({
    movietitle:String,
    movieyear:Number
});

const Movie = mongoose.model('Movie', movieSchema)
const title = faker.lorem.sentence(4);
const year = Math.floor(Math.random() * 80) + 1950;

const myMovie = new Movie( {movietitle:title, movieyear:year});

myMovie.save((err, savedMovie) => {
    if(err) {
    console.error(err);
    } else {
        console.log('saveMovie', savedMovie);
    }

});

const PORT = 5000;
let frenchMovies = [];

app.use('/public', express.static('public'))
//app.use(bodyParser.urlencoded({ extended: false }));

const secret = 'qsdjS12ozehdoIJ123DJOZJLDSCqsdeffdg123ER56SDFZedhWXojqshduzaohduihqsDAqsdq';


app.use(expressJwt({secret: secret}).unless({path: ['/', '/movies', '/movie-search', '/login']}));



app.set('views', './views');
app.set('view engine','ejs');



app.get('/movies', (req, res) => {

  const title= 'Les films français des 30 dernières années';

 frenchMovies = [];
 Movie.find((err, movies) => {
     if(err) {
         console.error('could not retrieve movies from DB');
         console.sendStatus(500)
     } else {
         frenchMovies = movies;
         res.render('movies', {movies:frenchMovies, title:title});
     }
 });

app.put('/movies/:id', (req,res) => {
    const id = req.params.id;
    res.send(`PUT resquest to movie of id ${id}`);
});
  //res.send('Bientôt des films ici');
});
var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Travailler avec Multer
//     app.post('/movies', urlencodedParser,(req, res) => {
//     console.log('Le titre : ', req.body.movietitle);
//     console.log('Année : ', req.body.movieyear);
//     const newMovie = {title : req.body.movietitle, year: req.body.movieyear };
//     //frenchMovies.push(newsMovie);
//     frenchMovies = [...frenchMovies, newMovie];
//     console.log(frenchMovies);
//     res.sendStatus(201);
// })

app.post('/movies', upload.fields([]), (req,res)  =>{
    if(!req.body) {
        return res.sendStatus(500);
    } else {
        const formdata = req.body;
        console.log('forData: ', formdata );
        const newMovie = {title : req.body.movietitle, year: req.body.movieyear };
        frenchMovies = [...frenchMovies, newMovie];
        res.sendStatus(201);
    }
})




//app.get('/movie-detail', (req, res) => {
    //res.send('Bientôt des films ici');
    //res.render('movie-details');
 //});


app.get('/movies/add', (req, res) => {
    res.send('Bientôt un formulaire d\'ajout ici')
});

app.get('/movies/:id', (req, res) => {
    const id = req.params.id;
    const title = req.params.title;
  //res.send(`film numéro ${id}`);
  //const title = 'terminator';
  res.render('movie-details', {movieid :id} );
});

app.get('/', (req, res) => {
    //res.send('hello <b>world ????</b>');
    res.render('index');

});

app.get('/movie-search', (req,res) =>{
    res.render('movie-search');
})

app.get('/login', (req,res) => {
    res.render('login', {title : 'Espace membre'});
});

const fakeUser = { email: 'testuser@testmail.fr', password: 'qsd' };


app.post('/login' , urlencodedParser, (req,res) => {
    console.log('login post', req.body);
    if(!req.body) {
        res.sendStatus(500);
    } else {
        if(fakeUser.email === req.body.email && fakeUser.password === req.body.password) {
            const myToken = jwt.sign({iss :'http://expressmovie.fr', user:'Sam',role:'moderator'}, secret);
            res.json(myToken);
            // res.json ({
            //     email:'testuser@testmail.fr',
            //     favoriteMovie:'Il était une fois dans l\'ouest',
            //     favoriteMovieTheater:'Ciné TMB, 1 rue Saint-Hellier, 35040 Rennes',
            //     lastLoginDate:new Date()
            // });
        } else {
            res.sendStatus(401);
        }
    }
});


app.get('/member-only', (req, res,) => {
    console.log('req.user', req.user);
    res.send(req.user);
});


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});