const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Task API',
    version: '1.0.0',
    description: 'A simple CRUD API for managing tasks'
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/tasks': {
      get: {
        summary: 'Get all tasks',
        responses: { '200': { description: 'List of tasks' } }
      },
      post: {
        summary: 'Create a new task',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { title: { type: 'string' } },
                required: ['title']
              }
            }
          }
        },
        responses: { '201': { description: 'Created task' } }
      }
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get a single task by ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '200': { description: 'Task found' }, '404': { description: 'Not found' } }
      },
      put: {
        summary: 'Update a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  done: { type: 'boolean' }
                }
              }
            }
          }
        },
        responses: { '200': { description: 'Updated task' } }
      },
      delete: {
        summary: 'Delete a task',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
        responses: { '204': { description: 'Deleted' }, '404': { description: 'Not found' } }
      }
    }
  }
};

app.get('/', (req, res) => {
  res.json({
    name: 'Task API',
    version: '1.0',
    endpoints: ['/tasks']
  })
});

let tasks = [
  { id: 1, title: 'Just Walking', done: false },
  { id: 2, title: 'Driving', done: false },
  { id: 3, title: 'Write documentation', done: false }
];

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not available /found` });
  }

  res.json(task);
});

app.get

app.get('/health',(req,res) => {
  res.json({ status: 'ok'})
});

app.post('/tasks',(req,res) => {
  const {title} = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({error: "Title is required"})
  }
let n_id= 4
  const newTask = {
    id: n_id++,
    title: title.trim(),
    done: false
  }
  tasks.push(newTask)
  res.status(201).json(newTask)
})

app.put('/tasks/:id',(req,res) => {
  const id = parseInt(req.params.id)
  const task = tasks.find(t=> t.id === id)
  if (!task){
    return res.status(404).json({error: `Task not found`})
  }
    const { title, done } = req.body;
  if (title !== undefined) {
    if (title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    task.title = title.trim();
  }
  if (done !== undefined) {
    task.done = Boolean(done);
  }
  res.status(200).json(task);
})

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: `Task ${id} not found` });
  }
  tasks.splice(index, 1);
  res.status(204).send(); 
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});