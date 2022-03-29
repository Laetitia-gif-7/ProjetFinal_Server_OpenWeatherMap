const express = require('express')
const https = require('https')
const app = express()
const request = require('request')
const mongoose = require('mongoose')
const cron = require('node-cron')
const cors = require('cors');
const urlocal='mongodb://localhost:27017'
const url= process.env.URL_MONGO || urlocal;
const bodyParser = require('body-parser');
const Weather = require("./weather");
const { response } = require('./app');
const MONGO_URL = process.env.MONGO_URL;
require('dotenv').config({path:"./.env"})
const PORT = process.env.PORT



//let options = {json: true};
app.use(bodyParser.json());
app.use(cors({origin: '*'}))
app.get('/', (req, res) => { 
    res.send('Robot is running')
});
app.listen(PORT);

//connection à MongoDB
mongoose.connect(MONGO_URL,
 {   //pour recuperer le 1er paramètre, aller sur mongodb, cliquer sur connect > connect your application
     useNewUrlParser: true, useUnifiedTopology:true
    }).then(()=>{
        console.log("connexion success !");//si ça fonctionne on affiche cela dans la console
    }).catch((error) =>{
        console.log(error); //sinon on affiche l'erreur
    });

app.get('/weathers', (req, res) =>{

    Weather.find({})
    .then((weathers)=>{
        console.log(weathers);
        return res.status(200).json({weathers})
        
    }) 
    .catch((err)=>{
        return res.status(400).json({err})
    })

})

// app.get('/weathers/:name', (req, res) =>{

//     var name = req.params.name;
    

//     Weather.find({})
//     .then((weathers)=>{
//         let weatherByCity= weathers.filter(function(weather){
//             return weather.name == name
//         })
//         return res.status(200).json({weatherByCity})
//     }) 
//     .catch((err)=>{
//         return res.status(400).json({err})
//     })

// }) 

app.get('/weathers/:name/:date/:month/:year/:hour', (req, res) =>{

    var date = req.params.date;
    var month = req.params.month;
    var year = req.params.year;
    var hour = req.params.hour;
    var name = req.params.name;

    let test = new Date(year, month, date, hour)

  
    Weather.find({})
    .then((weathers)=>{
        let weatherByCountry= weathers.filter(function(weather){
            //console.log(weather.dt_txt.getHours() +" "+ test.getHours());
            return ( 
            weather.dt_txt.getDate() == test.getDate() &&
            weather.dt_txt.getMonth() == test.getMonth() &&
            weather.dt_txt.getFullYear() == test.getFullYear() &&
            weather.dt_txt.getHours() == (test.getHours() +1) &&
            weather.name == name
            )
        })
        return res.status(200).json({weatherByCountry})
    }) 
    .catch((err)=>{
        return res.status(400).json({err})
    })

}) 
        
