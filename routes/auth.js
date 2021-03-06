const router = require('express').Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res) =>{
    //validate data
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the user is already in db
    const emailExist = await User.findOne({
        email: req.body.email
    })
    if(emailExist) return res.status(400).send('Email already exists')

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    try{
        const savedUser = await user.save()
        res.send({user: user._id})
    }catch(err) {
        res.status(400).send(err)
    }
})

//login
router.post('/login', async (req, res) => {
    //validate data
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    //checking if the email exists
    const user = await User.findOne({
        email: req.body.email
    })
    if(!user) return res.status(400).send('Email not found')

    //checking if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send('Invalid password')

    //create and assign jwt
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})

module.exports = router
