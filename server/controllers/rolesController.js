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

//CREATE a new role
const addOneRole = async (req, res) => {
  try {
    const newRole = await Role.create(req.body);
    res.status(201).json({role: newRole});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//DELETE one role
const deleteOneRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);
    res.status(202).json({role: role});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

//UPDATE one role
const updateOneRole = async (req, res) => {
  const { id } = req.params;
  try {
    const role = await Role.findByIdAndUpdate(id, {
      ...req.body,
    }, {returnDocument: 'after'});
    res.status(202).json({role: role});
  } catch (error) {
    res.status(400).json({error: error.message});
  }
};

module.exports = {
  getAllRoles,
  getOneRole,
  addOneRole,
  deleteOneRole,
  updateOneRole,
};
