require('dotenv').config()
const express = require('express')
const app = express()
const bcrypt = require('bcrypt');
var methodOverride = require('method-override')
const flash = require('express-flash')
const saltRounds = 10;
const initializePasseport = require('./passport-config')
const passport = require('passport');
const session = require('express-session')


initializePasseport(
    passport,
    email => users.find(user=> user.email === email),
    id => users.find(user=> user.id === id)
)

const users = []

app.set("view-engine", "ejs")
app.use(express.urlencoded({ extended:false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())




app.get('/', checkAuthenticated ,(req,res)=>{
    res.render('index.ejs', {name: req.user.name})
})

app.get('/login',checkNotAuthenticated, (req,res)=>{
    res.render('login.ejs')
})

app.post('/login',checkNotAuthenticated,passport.authenticate("local", {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash:true
}))
app.get('/register', checkNotAuthenticated,(req,res)=>{
    res.render('register.ejs', {name: "Tarik"})
})


app.post('/register',checkNotAuthenticated, async (req,res)=>{
    
   try {
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds)
    // Store hash in your password DB.
    users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email : req.body.email,
        password : hashedPassword
    })
    res.redirect('/login')
   } catch {
    res.redirect('/register')
   }
   console.log(users)
})

app.delete('/logout',)

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
       return res.redirect('/login')  
    }
    return next()
}

app.listen(3000)