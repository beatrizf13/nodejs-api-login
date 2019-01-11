const express = require('express');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

exports.get = async (req, res) => {
  try {
    const projects = await Project.find().populate(['user', 'tasks']);

    return res.send({ projects });

  } catch (err) {
    return res.status(400).send({ message: "error -> " + err });
  }
}

exports.getById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

    return res.send({ project });
  } catch (err) {
    return res.status(400).send({ message: "error -> " + err });
  }
}

exports.post = async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const project = await Project.create({ title, description, user: req.userId });

    await Promise.all(tasks.map(async task => {
      const projectTask = new Task({ ...task, project: project._id });

      await projectTask.save();

      project.tasks.push(projectTask);
    }));

    await project.save();

    return res.send({ project });

  } catch (err) {
    return res.status(400).send({ message: "error -> " + err });
  }
}

exports.put = async (req, res) => {
  try {
    const { title, description, tasks } = req.body;

    const project = await Project.findByIdAndUpdate(req.params.projectId, { title, description }, { new: true });

    project.tasks = [];
    await Task.remove({ project: project._id });

    await Promise.all(tasks.map(async task => {
      const projectTask = new Task({ ...task, project: project._id });

      await projectTask.save();

      project.tasks.push(projectTask);
    }));

    await project.save();

    return res.send({ project });

  } catch (err) {
    return res.status(400).send({ message: "error -> " + err });
  }
}

exports.delete = async (req, res) => {
  try {
    await Project.findByIdAndRemove(req.params.projectId);

    return res.send();

  } catch (err) {
    return res.status(400).send({ message: "error -> " + err });
  }
}

//module.exports = app => app.use('/projects', router);