let express  = require('express');
let app      = express();                               // create our app w/ express                // mongoose for mongodb
//let morgan = require('morgan');             // log requests to the console (express4)
let bodyParser = require('body-parser');    // pull information from HTML POST (express4)
let methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
let mysql      = require('mysql');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
let session = require('express-session');
//app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 1000*60 }}))

let connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'northwind'
});

connection.connect((err)=> {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }else{
  	console.log("Connect MySQL");
  }
});
app.listen(1711,(a)=>{
    console.log("App listening on port 3000");
 
 });
let dirName = __dirname;

function cors(res){
res.header("Content-Type", "application/json; charset=utf-8");
res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
res.header("Access-Control-Allow-Origin", "*");
}

require(__dirname+'/Model/index_model.js')(app,dirName,connection,session,cors);
app.use(express.static(__dirname+'/'));    
