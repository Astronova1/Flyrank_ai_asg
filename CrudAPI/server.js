require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const swaggerUi = require('swagger-ui-express');

app.use(express.json());
const repo = require('./postgrerepo')

// const dbcheck = db.prepare('SELECT COUNT(*) AS count FROM tasks').get()
// if (dbcheck.count ===0){
//   const insert = db.prepare('INSERT INTO tasks(title,done) VALUES (?,?)') 
//   insert.run("Shopping",0)
//   insert.run("Workout",0)
//   insert.run("study",0)
// }

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

app.get('/tasks', async (req, res) => {
  const all_tasks = await repo.getAll()
    res.status(200).json(all_tasks) 
});

app.get('/tasks/:id'  , async (req, res) => {
  const task = await repo.getById(req.params.id);
  if (!task) {
    return res.status(404).json({ error: `Task not available found` });
  }

  res.status(200).json(task);
});


app.get('/health',(req,res) => {
  res.json({ status: 'ok'})
});

app.post('/tasks',async (req,res) => {
  const {title, done} = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({error: "Title is required"})
  }
  const new_task = await repo.create(title.trim(),Boolean(done))
  res.status(201).json(new_task) 
})

app.put('/tasks/:id', async (req, res) => {
  const { title, done } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const updated = await repo.update(req.params.id, title.trim(), Boolean(done));
  if (!updated) return res.status(404).json({ error: 'Task not found' });
  res.json(updated);
});

app.delete('/tasks/:id', async (req, res) => {
  const existing = await repo.getById(req.params.id);
  if (!existing) return res.status(404).json({ error: 'Task not found' });
  await repo.remove(req.params.id);
  res.status(204).send();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});