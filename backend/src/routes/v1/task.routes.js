const express = require('express');
const router = express.Router();
const { getAllTasks, getTask, createTask, updateTask, deleteTask } = require('../../controllers/taskController');
const { protect } = require('../../middleware/auth');
const { createTaskValidator, updateTaskValidator } = require('../../validators/task.validator');

/**
 * @swagger
 * tags:
 *   name: Tasks
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [pending, in_progress, completed] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [low, medium, high] }
 *     responses:
 *       200: { description: Task list }
 *   post:
 *     summary: Create task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string }
 *               priority: { type: string }
 *               dueDate: { type: string }
 *     responses:
 *       201: { description: Created }
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Task }
 *   put:
 *     summary: Update task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Updated }
 *   delete:
 *     summary: Delete task
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Deleted }
 */
router.get('/', protect, getAllTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, createTaskValidator, createTask);
router.put('/:id', protect, updateTaskValidator, updateTask);
router.delete('/:id', protect, deleteTask);

module.exports = router;