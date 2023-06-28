/* eslint-disable consistent-return */
const Role = require('../model/Role');

// GET all roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({}).sort({name: 1});
    res.status(200).json({roles: roles});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//GET one role
const getOneRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    res.status(200).json({role: role});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  getAllRoles,
  getOneRole,
};
