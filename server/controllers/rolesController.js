/* eslint-disable consistent-return */
const User = require('../model/User');
const Role = require('../model/Role');

// GET all roles
const getAllRoles = async (req, res) => {
    try {
      const roles = await Role.find({}).sort({name: 1});
      res.status(200).json(roles);
    } catch (error) {
      res.status(400).json({error: error.message});
    }
};

//GET one role
// const getOneRole = (req, res) => {
//     try {
//       const role = req.userData;
//       res.status(200).json({user: user});
//     } catch (error) {
//       res.status(400).json({error: error.message});
//     }
//   };

module.exports = {
    getAllRoles
  };