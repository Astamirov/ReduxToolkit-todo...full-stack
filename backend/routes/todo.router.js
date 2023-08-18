const {Router} = require('express')
const {todoController} = require('../controllers/todo.controller')
const router = Router()

router.get('/getTodo', todoController.getTodo)
router.post('/postTodo', todoController.postTodo)
router.patch('/patchTodo/:id', todoController.patchTodo)
router.delete('/deleteTodo/:id', todoController.deleteTodo)

module.exports = router