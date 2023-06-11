
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authenticate = require('../middleware/atc');
const { body, validationResult } = require('express-validator');
require('../DB/conn');

const User = require("../models/userSchema");

// router.get('/', (req, res) => {
//     res.send(`hello world from the server router js`);
// });

// Promise method

// router.post('/register' , (req, res) => {
//     const { name, email, phone, work, password, cpassword } = req.body;

//     if( !name || ! email || ! phone || ! work|| ! password || !cpassword ){
//         return res.status(422).json({error: "plz fill the filled properly" });
//     }
    
//     User.findOne({email: email})
//     .then((userExist) => {
//         if (userExist){
//             return res.status(422).json({ error: "Email already exist"});
//         }
    
//     const user = new User({name, email, phone, work, password, cpassword });

//     user.save().then( () => {
//         res.status(201).json({ message: "user registered successfully"});
//     }).catch((err) => res.status(500).json({ error: "Failed to register"}));
// }).catch(( err => { console.log(err); }));
    
// });

//Async-await mehod

router.post('/register', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('phone').isNumeric().withMessage('Phone must be numeric'),
    body('work').notEmpty().withMessage('Work is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('cpassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    const { name, email, phone, work, password, cpassword } = req.body;
  
    try {
      const userExist = await User.findOne({ email: email });
  
      if (userExist) {
        return res.status(422).json({ error: "Email already exists" });
      } else {
        const user = new User({ name, email, phone, work, password, cpassword });
  
        const userRegister = await user.save();
  
        if (userRegister) {
          res.status(201).json({ message: "User registered successfully" });
        } else {
          res.status(500).json({ error: "Failed to register" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
// Login route

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
            
  const token = await user.generateAuthToken();
  res.cookie("jwtoken", token, {
    expires:new Date(Date.now() + 25892000000),
    secure: true, // set to true if your using https or samesite is none
    httpOnly: true, // backend only
    sameSite: 'none' // set to none for cross-request
  });
  res.json({ message: 'User signed in successfully', token });
});


// about us ka page

router.get('/about',authenticate,(req,res)=>{
    console.log(req.body);
    res.send (req.rootUser);
    
});

router.get('/getdata', authenticate,(req,res)=>{
    console.log(req.body);
    
    res.send (req.rootUser);
    
});



router.get('/logout',authenticate,(req,res)=>{
  res.clearCookie('jwtoken', {
    httpOnly: true,
    secure: true,
    sameSite: 'none', 
    path:'/', 
    domain: 'mernproject-backend.onrender.com'});
    req.User.save;
    res.json({ message: 'User logout successfully', token });
    
});


module.exports = router;