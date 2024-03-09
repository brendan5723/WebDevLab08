const express = require('express'); // Importing the Express.js module and creating an instance of an Express.js application.
let app = express(); // The app variable is assigned to the express function.


const cookieParser = require('cookie-parser'); // Importing the cookie-parser module.
const sessions = require('express-session'); // Importing the express-session module.

//middleware to config sesssion data
app.use(sessions({ // The use method is used to add the middleware to the application.
    secret: 'thisisasecret', // The secret key is used to sign the session ID cookie.
    saveUninitialized: false, // The saveUninitialized option is set to false, which means that the session will not be saved if it is not modified.
    resave: false // The resave option is set to false, which means that the session will not be saved if it is not modified.
    })
);









//middleware to use the EJS template engine
app.set('view engine', 'ejs');// The set method is used to set the view engine to EJS.

//middleware to be able POST <form> data 
app.use(express.urlencoded({extended: true}));// The use method is used to add the middleware to the application. 
//The express.urlencoded method is used to parse the data from the form.

//store favourite band in a global variable
let favband = "not choosen yet";






app.get('/fav',  (req, res) => {
    //get at the session object and store it ina local variable
    let sess_obj = req.session;
    //check to see if the key favband exists. If not then set if with the
    //string 'not choosen yet'
    if(!sess_obj.favband) {
        sess_obj.favband="not choosen yet";
    }
    //send the session object key favband to the band.ejs template
    res.render('band', {data: sess_obj.favband});
});

app.post('/fav',  (req, res) => {
    //get at the session object and store it in a local variable
    let sess_obj = req.session;
    //set the value from the text field equal to the session object key 'favband'
    sess_obj.favband = req.body.favourite;
    //send the session object key 'favband' to the band.ejs template
    res.render('band', {data: sess_obj.favband});
});


app.get('/page1',  (req, res) => {
    //get at the session object and store it ina local variable
    let sess_obj = req.session;
    //send the session object key 'favband' to the band.ejs template
   res.render('page1', {data: sess_obj.favband});
});

app.get('/page2',  (req, res) => {
   let sess_obj = req.session;
   res.render('page2', {data: sess_obj.favband});
});

//start the server
app.listen(process.env.PORT || 3000, ()=>{  // The listen method is used to start the server on port 3000.
    console.log("server started on: localhost:3000/fav"); // The server is started and a message is logged to the console.
});




//This is a simple web server program written in JavaScript using Express.js, a popular web framework. Here's what it does in simpler terms:

//1.) It starts by importing Express.js and creating a new Express application.

//2.) It then tells the application to use EJS, a tool that lets us create HTML templates with JavaScript.

//3.) It also tells the application to be able to understand data sent from HTML forms.

//4.) It creates a variable to store the name of a favorite band, initially set to "not chosen yet".

//5.) It sets up a page at the address '/fav'. When someone visits this page, it shows them the name of the favorite band.

//6.) It also allows someone to send data to the '/fav' address (like submitting a form). When this happens, it changes the favorite band to whatever was sent, and then shows the new favorite band.

//7.) It sets up two more pages at the addresses '/page1' and '/page2'. When someone visits these pages, they also show the name of the favorite band.