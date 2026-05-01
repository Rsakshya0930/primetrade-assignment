const { validationResult } = require('express-validator');
const { Task, User } = require('../models');

exports.getAllTasks = async (req, res, next) => {
  try {
    const { status, priority, page = 1, limit = 10 } = req.query;
    const where = {};
    if (req.user.role !== 'admin') where.userId = req.user.id;
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const include = req.user.role === 'admin'
      ? [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }] : [];

    const { count, rows } = await Task.findAndCountAll({
      where, limit: +limit, offset: (+page - 1) * +limit,
      order: [['createdAt', 'DESC']], include,
    });

    res.json({ success: true, data: rows,
      pagination: { total: count, page: +page, limit: +limit, pages: Math.ceil(count / limit) } });
  } catch (err) { next(err); }
};

exports.getTask = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role !== 'admin') where.userId = req.user.id;
    const task = await Task.findOne({ where });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  } catch (err) { next(err); }
};

exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const { title, description, status, priority, dueDate } = req.body;
    const task = await Task.create({ title, description, status, priority, dueDate, userId: req.user.id });
    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (err) { next(err); }
};

exports.updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
    const where = { id: req.params.id };
    if (req.user.role !== 'admin') where.userId = req.user.id;
    const task = await Task.findOne({ where });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await task.update(req.body);
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (err) { next(err); }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const where = { id: req.params.id };
    if (req.user.role !== 'admin') where.userId = req.user.id;
    const task = await Task.findOne({ where });
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    await task.destroy();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) { next(err); }
};