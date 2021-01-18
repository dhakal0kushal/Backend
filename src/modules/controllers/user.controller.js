const userRepository = require('../services/user');
const {
    hash,
    compare
} = require('../../utils/bcrypt')
const {
    sign
} = require("../../utils/jwt");
const passport = require('passport');


exports.registerUser = async (req, res) => {
    try {
        let payload = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            gender: req.body.gender,
            phone: req.body.phone,
            password: await hash(req.body.password),
            photo: req.body.photo
        }

        let user = await userRepository.createUser(payload)
        res.status(200).json({
            msg: "user created",
            status: true,
            data: user
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            error: err,
            status: false
        })
    }
}


exports.loginUser = async (req, res, next) => {
    try {
        let {
            email,
            password
        } = req.body;

        console.log(email, password);
        let user = await userRepository.getUserByEmail(email);
        if (!user) {
            res.status(400).json({
                msg: `Wrong Login Details`,
                status: 400
            })
        }
        let match = await compare(password, user.password);
        if (match) {
            let token = await sign(user);
            res.status(200).json({
                success: true,
                token: token,
                data: user
            })
        } else {
            res.status(400).json({
                msg: `Wrong Login Details`,
                status: 400
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            error: err,
            status: false
        })
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        let users = await userRepository.getAllUsers();
        res.status(200).json({
            success: true,
            data: users
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            error: err,
            status: false
        })
    }
}

exports.authenticateUserWithGoogle = passport.authenticate('google', {
    scope: ['profile']
})

exports.authenticateUserWithFacebook = passport.authenticate('facebook', {
    scope: ['profile']
})

exports.handleFacebookAuthenticationCallback = async (req, res, next) => {

}
exports.handleGoogleAuthenticationCallback = async (req, res, next) => {

}