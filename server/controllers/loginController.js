const mongoose = require('mongoose')

//
const createAccount = async (req, res) => {
    const {name, password} = req.body

    try {
        const account = await Account.create({name, password})
        res.status(200).json(account)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    createAccount
}