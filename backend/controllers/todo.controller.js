const Todo = require('../models/Todo.models')

module.exports.todoController = {
    postTodo: async (req, res) => {
        try {
            const {text} = req.body;
            const data = await Todo.create({
                text,
                completed: false,
            })
            res.json(data)
        } catch (error) {
            res.json(error)
        }
    },
    getTodo: async (req, res) => {
        try {
            const data = await Todo.find({});
            res.json( data)
        } catch {
            res.json(error)
        }
    },
    deleteTodo: async (req, res) => {
        try {
            const data = await Todo.findByIdAndRemove(req.params.id);
            res.json(data)
        } catch {
            res.json(error)
        }
    },
    patchTodo: async (req, res) => {
        const {completed} = req.body
        try{
            const data = await Todo.findByIdAndUpdate(req.params.id, {completed})
            res.json(data)
        } catch {
            res.json(error.massage)
        }
    }
}