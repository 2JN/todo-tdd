const httpMocks = require('node-mocks-http')
const TodoModel = require('../../models/todo.model')
const TodoController = require('../../controllers/todo.controller')
const newTodo = require('../mock-data/new-todo.json')
const allTodos = require('../mock-data/all-todos.json')

const todoId = '624dc3aa88d8b049fdc7159a'

jest.mock('../../models/todo.model')

let req, res, next
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
})

describe('TodoController.getTodos', () => {
  it('should have a get function', async () => {
    expect(typeof TodoController.getTodos).toBe('function')
  })

  it('should call TodoModel.find({})', async () => {
    await TodoController.getTodos(req, res, next)
    expect(TodoModel.find).toHaveBeenCalledWith({})
  })

  it('should return 200 response and all todos', async () => {
    TodoModel.find.mockReturnValue(allTodos)
    await TodoController.getTodos(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(allTodos)
  })

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error finding' }
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.find.mockReturnValue(rejectedPromise)

    await TodoController.getTodos(req, res, next)
    expect(next).toHaveBeenCalledWith(errorMessage)
  })
})

describe('TodoController.getTodoById', () => {
  it('should have a getTodoById', () => {
    expect(typeof TodoController.getTodoById).toBe('function')
  })

  it('should call TodoModel.findById with route parameter', async () => {
    req.params.id = todoId
    await TodoController.getTodoById(req, res, next)
    expect(TodoModel.findById).toHaveBeenCalledWith(todoId)
  })

  it('should return json body and response code 200', async () => {
    TodoModel.findById.mockReturnValue(newTodo)
    await TodoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error finding' }
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.find.mockReturnValue(rejectedPromise)

    await TodoController.getTodos(req, res, next)
    expect(next).toHaveBeenCalledWith(errorMessage)
  })

  it('should return 404 if no todo found', async () => {
    TodoModel.findById.mockReturnValue(null)
    await TodoController.getTodoById(req, res, next)

    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })
})

describe('TodoController.createTodo', () => {
  beforeEach(() => {
    req.body = newTodo
  })

  it('should have a creation function', () => {
    expect(typeof TodoController.createTodo).toBe('function')
  })

  it('should call TodoModel.create', async () => {
    await TodoController.createTodo(req, res, next)
    expect(TodoModel.create).toBeCalledWith(newTodo)
  })

  it('should return 201 response code', async () => {
    await TodoController.createTodo(req, res, next)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
  })

  it('should return a json body in response', async () => {
    TodoModel.create.mockReturnValue(newTodo)
    await TodoController.createTodo(req, res, next)
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })

  it('should handle errors', async () => {
    const errorMessage = { message: 'Done property missing' }
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.create.mockReturnValue(rejectedPromise)

    await TodoController.createTodo(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
})

describe('TodoController.updateTodo', () => {
  it('should have an update function', () => {
    expect(typeof TodoController.updateTodo).toBe('function')
  })

  it('should call TodoModel.findByIdAndUpdate', async () => {
    req.params.id = todoId
    req.body = newTodo
    await TodoController.updateTodo(req, res, next)
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
    })
  })

  it('should return 200 response code with updated data', async () => {
    req.params.id = todoId
    req.body = newTodo
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo)

    await TodoController.updateTodo(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' }
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)

    await TodoController.updateTodo(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })

  it('should return 404 if no todo found', async () => {
    req.params.id = todoId
    req.body = newTodo
    TodoModel.findByIdAndUpdate.mockReturnValue(null)

    await TodoController.updateTodo(req, res, next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })
})

describe('TodoController.deleteTodo', () => {
  it('should have a delete function', () => {
    expect(typeof TodoController.deleteTodo).toBe('function')
  })

  it('should call TodoModel.findByIdAndDelete', async () => {
    req.params.id = todoId

    await TodoController.deleteTodo(req, res, next)
    expect(TodoModel.findByIdAndDelete).toBeCalledWith(todoId)
  })

  it('should return 200 response code with deleted data', async () => {
    req.params.id = todoId
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo)

    await TodoController.deleteTodo(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })

  it('should handle errors', async () => {
    const errorMessage = { message: 'Error' }
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise)

    await TodoController.deleteTodo(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })

  it('should return 404 if no todo found', async () => {
    req.params.id = todoId
    TodoModel.findByIdAndDelete.mockReturnValue(null)

    await TodoController.deleteTodo(req, res, next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled).toBeTruthy()
  })
})
