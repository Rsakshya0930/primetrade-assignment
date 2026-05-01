const { body } = require('express-validator');

exports.createTaskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isDate().withMessage('Invalid date'),
];

exports.updateTaskValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('status').optional().isIn(['pending', 'in_progress', 'completed']).withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('dueDate').optional().isDate().withMessage('Invalid date'),
];