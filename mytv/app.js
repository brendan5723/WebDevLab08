const express = require('express');
const app = express();
const mysql  = require('mysql2');



app.use(express.static('public'));//serve static files from the public directory

app.use(express.json()); //parse JSON body data

app.use(express.urlencoded({extended: true}));//parse URL-encoded body data

const cookieParser = require('cookie-parser');
const sessions = require('express-session');

const oneHour = 1000 * 60 * 60 * 1;

app.use(cookieParser());

app.use(sessions({
   secret: "myshows14385899",
   saveUninitialized: true,
   cookie: { maxAge: oneHour },
   resave: false
}));







const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bgribben_lab08',  //change to your DB name
    port: '3306'
});

app.set('view engine', 'ejs');//set the view engine to ejs


app.use(express.urlencoded({extended: true}));

app.post('/', (req,res) => {
    const useremail = req.body.emailField;
    const checkuser = `SELECT * FROM my_users WHERE email = "${useremail}" `;

    db.query(checkuser, (err, rows) => {
        if(err) throw err;
        const numRows = rows.length;
        
        if(numRows > 0){

            const sessionobj = req.session;  
            sessionobj.authen = rows[0].id; 

            res.redirect('/dashboard');
        }else{
            res.redirect('/');

        }

});

});


app.get('/dashboard', (req,res) => {
    const sessionobj = req.session;
    if(sessionobj.authen){
        
        const uid = sessionobj.authen;
        const user = `SELECT * FROM my_users WHERE id = "${uid}" `;
        
        db.query(user, (err, row)=>{ 
            const firstrow = row[0];
            res.render('dashboard', {userdata:firstrow});
        });
    }else{
        res.send("denied");
    } 
});



app.get('/', (req,res) => { //create a route for the home page
    res.render('login'); //render the 'login' view
    
});//end of the route


app.get('/shows/:showid', async (req,res) => {
    
    const Id = req.params.showid;
    let tvshow = await db.promise().query(`SELECT * FROM my_shows WHERE id = ${Id}`);
    let tvactors = await db.promise().query(`SELECT * FROM my_cast INNER JOIN my_actors ON my_cast.actorid = my_actors.id WHERE my_cast.showid = ${Id};`);

    const sqlres = {
         tv: tvshow[0],
         actors : tvactors[0] 
    }

    res.json(sqlres);
});



app.get('/shows',(req,res) => {

    db.query(showsql, (err, rows1) => {
        if(err) throw err;

        const actorsql = `SELECT * FROM my_actors ORDER BY actorname DESC LIMIT 4`;
       
         db.query(actorsql, (err2, rows2) => {
            if(err) throw err2;
            res.render('tv', {shows: rows1, actors: rows2});
            
         });
    });
    
});

const showsql = `SELECT * FROM my_shows LIMIT 6`;
    




app.listen(3000,()=>{//listen to port 3000
    console.log('Server on port 3000');//log a message to the console
});