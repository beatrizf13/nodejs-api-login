const express = require('express');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');

exports.get = async (req, res) => {
    try {
      const tasks = await Task.find();
  
      return res.send({ tasks });
  
    } catch (err) {
      return res.status(400).send({ message: "error -> " + err });
    }
}

exports.getDones = async (req, res) => {
    try {
      const tasks = await Task.find({
          completed: true
      });
  
      return res.send({ tasks });
  
    } catch (err) {
      return res.status(400).send({ message: "error -> " + err });
    }
}

exports.getNotDones = async (req, res) => {
    try {
      const tasks = await Task.find({
          completed: false
      });
  
      return res.send({ tasks });
  
    } catch (err) {
      return res.status(400).send({ message: "error -> " + err });
    }
}

exports.getById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

        return res.send({ project });

    } catch (err) {
        return res.status(400).send({ message: "error -> " + err });
    }
}

exports.post = async (req, res) => {
    try {
      const { title, projectId } = req.body;
  
      const task = await Task.create({ title, project: projectId, assignedTo: req.userId });
      
      const project = await Project.findById(projectId);

        if (project){
            project.tasks.push(task);
            return res.send({ task });

        } else{
            return res.status(400).send({ message: "error: project does not exists" });
        }

    } catch (err) {
        return res.status(400).send({ message: "error -> " + err });
    }
}

exports.markDone = async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.taskId, { completed: true }, { new: true })

      if (!task) {
        return res.status(400).send({ message: "error: task does not exists" });
      }
      return res.send({ task });

    } catch (err) {
        return res.status(400).send({ message: "error -> " + err });
    }
}

exports.markNotDone = async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(req.params.taskId, { completed: false }, { new: true })

      if (!task) {
        return res.status(400).send({ message: "error: task does not exists" });
      }
      return res.send({ task });

    } catch (err) {
        return res.status(400).send({ message: "error -> " + err });
    }
}

exports.put = async (req, res) => {
    try {
      const { title } = req.body;
  
      const task = await Task.findByIdAndUpdate(req.params.taskId, { title }, { new: true })

      if (!task) {
        return res.status(400).send({ message: "error: task does not exists" });
      }
      return res.send({ task });

    } catch (err) {
        return res.status(400).send({ message: "error -> " + err });
    }
}

exports.delete = async (req, res) => {
    try {
        await Task.findByIdAndRemove(req.params.taskId);
        return res.send();
    
    } catch (err) {
        return res.status(400).send({ message: "error -> " + err });
    }
}