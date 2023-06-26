const mongoose = require('mongoose')
const User = require('../model/User.js');

//
const login = async (req, res) => {
    const {userName, password} = req.body

    try {
        const account = await User.findOne({userName: userName})
        if (account.password === password) {
            res.status(200).json({token: account._id})
        } else {
            res.status(401).json({error: "Wrong password"})
        }
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    login
}