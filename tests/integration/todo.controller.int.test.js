const request = require('supertest')

const app = require('../../app')
const newTodo = require('../mock-data/new-todo.json')

const endpointUrl = '/todos/'
const fakeId = '4e5cea463acf9d0a8c8b4567'
let firstTodo
let newTodoId

describe(endpointUrl, () => {
  it(`GET ${endpointUrl}`, async () => {
    const response = await request(app).get(endpointUrl)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(['value'])).toBe(true)
    expect(response.body[0].title).toBeDefined()
    expect(response.body[0].done).toBeDefined()
    firstTodo = response.body[0]
  })

  it(`GET ${endpointUrl}/:id`, async () => {
    const response = await request(app).get(`${endpointUrl}${firstTodo._id}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toStrictEqual(firstTodo)
  })

  it(`GET ${endpointUrl}/:id - not found`, async () => {
    const response = await request(app).get(`${endpointUrl}${fakeId}`)

    expect(response.statusCode).toBe(404)
  })

  it(`POST ${endpointUrl}`, async () => {
    const response = await request(app).post(endpointUrl).send(newTodo)

    expect(response.statusCode).toBe(201)
    expect(response.body.title).toBe(newTodo.title)
    expect(response.body.done).toBe(newTodo.done)
    newTodoId = response.body._id
  })

  it(`should return 500 on malformed data with POST ${endpointUrl}`, async () => {
    const response = await request(app)
      .post(endpointUrl)
      .send({ title: 'missing done prop' })

    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual({
      message: 'Todo validation failed: done: Path `done` is required.',
    })
  })

  it(`PUT ${endpointUrl}/:id`, async () => {
    const response = await request(app)
      .put(`${endpointUrl}${firstTodo._id}`)
      .send({ title: 'updated title' })

    expect(response.statusCode).toBe(200)
    expect(response.body.title).toBe('updated title')
  })

  it(`PUT ${endpointUrl}/:id - not found`, async () => {
    const response = await request(app)
      .put(`${endpointUrl}${fakeId}`)
      .send({ title: 'updated title' })

    expect(response.statusCode).toBe(404)
  })

  it(`DELETE ${endpointUrl}/:id`, async () => {
    const response = await request(app).delete(`${endpointUrl}${firstTodo._id}`)

    expect(response.statusCode).toBe(200)
    expect(response.body._id).toBe(firstTodo._id)
  })

  it(`DELETE ${endpointUrl}/:id - not found`, async () => {
    const response = await request(app).delete(`${endpointUrl}${fakeId}`)

    expect(response.statusCode).toBe(404)
  })
})
