
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const fs = require('fs');

const bcrypt = require('bcrypt');

const app = express();
const port = 22102;


const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email)
)

app.set('view-engine', 'ejs')
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(flash())


app.use(session({
  secret: "RANDOMKEY123",
  resave: false,
  saveUninitialized: false,
  cookie:{maxAge: 60000}
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//users storage
let users = [];
var JSONofPurchase;

RefreshUsers();
function RefreshUsers() {
  //console.log("refreshed users");
  var rawUsers = fs.readFileSync('users.json', 'utf8');
  var jsonraw = JSON.parse(rawUsers);

  for (var i = 0; i < jsonraw.length; i++) {
    users.push(jsonraw[i]);
  }
}

//pages
app.get('/', (req, res) => { res.render('index', { user: req.user }) });
app.get('/seats/:id', checkAuthenticated, (req, res) => res.render('seats', {user: req.user}));
app.use('/public', express.static('public'));

//login
app.get('/users', restrict, (req, res) => { res.send(users) });
app.get('/login', checkNotAuthenticated, (req, res) => { res.render('login'); });
app.get('/register', checkNotAuthenticated, (req, res) => { res.render('register' , { errorMsg: errorMessage} ) });
app.get('/profile', checkAuthenticated, (req, res) => { res.render('profile', { name: req.user.email , receipt: JSONofPurchase}) });

app.get('/event/:id', (req, res) => res.send('event ma id: ' + req.params.id));

var files = [];

var seatsById = {}

app.get('/data/:id', (req, res) => { res.send(seatsById[req.params.id])} );

UpdateSeats();
function UpdateSeats() {
  console.log(files);
  fs.readdirSync('./events/').forEach(file => {
    files.push(file);
  });

  for (var i = 0; i < files.length; i++) {
    let rawSeats = fs.readFileSync('./events/' + files[i].toString());
    let seats = JSON.parse(rawSeats);

    seatsById[i] = seats

    //app.get('/data/' + i, (req, res) => { res.send(seats)} );
  }
  files = [];
}
//precteni a konvertovani json do objektu
//let rawSeats = fs.readFileSync('event2.json');
//let seats = JSON.parse(rawSeats);

var seatsBought;
app.post('/bought', function (req, res) {
  seatsBought = JSON.stringify(req.body);
  console.log(seatsBought);
});

var currentNumber;
app.post('/currentNumber', function (req, res) {
  var passedNumber = JSON.stringify(req.body);
  currentNumber = passedNumber.match(/\d+/)[0];

  res.send(JSON.stringify(req.body));
});


app.post('/add', function (req, res) {
  UpdateSeats();
  var passedJSON = JSON.stringify(req.body);
  var currUser = req.user;



  var JSONofPurchase = {user: currUser, seats: JSON.stringify(seatsBought)};
  console.log(currUser);
  console.log(JSONofPurchase);

  res.send(JSON.stringify(req.body));

  fs.writeFileSync('./events/event' + currentNumber + '.json', passedJSON, 'utf8');
  UpdateSeats();
});



//listen
app.set('view engine', 'ejs');
app.listen(port, () => console.log('Listening at port: ' + port));


let errorMessage;
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    let notUniqueEmail = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i].email === req.body.email) {
        notUniqueEmail = true;
      }
    }
    if (notUniqueEmail == true) {
      errorMessage = "User already exists";
      res.writeHead(301, { Location: '/register' }).end();
    } else {
      const hashedPassword = await bcrypt.hash(req.body.pass, 10);
      const user = { email: req.body.email, pass: hashedPassword };
      users.push(user);
      res.writeHead(301, { Location: '/login' }).end();
      RefreshUsers();
    }
    try {
      const result = JSON.stringify(users);
      fs.writeFileSync('users.json', result, 'utf8');
    }
    catch (err) {
      console.log('Writing to file error!');
    }
    res.status(201).send();  
  }
  catch (err) {
    res.status(500).send()
    console.log(err);
  }
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/logout', (req, res) => {
  req.logout(function(err) {
    if(err){
      return next(err);
    }
    console.log("logout completed");
    res.redirect('/login');
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

function restrict(req, res) {
  if (true) {
    return res.redirect('/');
  }
}

