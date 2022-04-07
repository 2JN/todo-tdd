const TodoModel = require('../models/todo.model')

exports.getTodos = async (req, res, next) => {
  try {
    const getModels = await TodoModel.find({})
    res.status(200).json(getModels)
  } catch (err) {
    next(err)
  }
}

exports.getTodoById = async (req, res, next) => {
  try {
    const getModel = await TodoModel.findById(req.params.id)

    if (!getModel) return res.status(404).json({ message: 'Not found' })

    res.status(200).json(getModel)
  } catch (err) {
    next(err)
  }
}

exports.createTodo = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body)
    res.status(201).json(createdModel)
  } catch (err) {
    next(err)
  }
}

exports.updateTodo = async (req, res, next) => {
  try {
    const updatedModel = await TodoModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!updatedModel) return res.status(404).json({ message: 'Not found' })

    res.status(200).json(updatedModel)
  } catch (err) {
    next(err)
  }
}

exports.deleteTodo = async (req, res, next) => {
  try {
    const deletedModel = await TodoModel.findByIdAndDelete(req.params.id)

    if (!deletedModel) return res.status(404).json({ message: 'Not found' })

    res.status(200).json(deletedModel)
  } catch (err) {
    next(err)
  }
}
