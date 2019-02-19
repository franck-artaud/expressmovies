const express = require('express');
const app = express();
const PORT = 5000;

app.use('/public', express.static('public'))

app.set('views', './views');
app.set('view engine','ejs');



app.get('/movies', (req, res) => {

  const title= 'Les films français des 30 dernières années';

  const frenchMovies = [
      { title: 'Le fabuleux destin d\'Amélie Poulain', year:'2001'},
      { title: 'Buffet froid', year:'1979'},
      { title: 'Le diner de con ', year:'1978'},
      { title: 'De rouille et d\'os', year:'2012'}
  ];

  //res.send('Bientôt des films ici');
  res.render('movies', {movies:frenchMovies, title:title});
});

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

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});