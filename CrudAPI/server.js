const Database = require('better-sqlite3');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

const db = new Database('tasks.db')
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  done boolean NOT NULL
  )
  `)

const dbcheck = db.prepare('SELECT COUNT(*) AS count FROM tasks').get()
if (dbcheck.count ===0){
  const insert = db.prepare('INSERT INTO tasks(title,done) VALUES (?,?)') 
  insert.run("Shopping",0)
  insert.run("Workout",0)
  insert.run("study",0)
}

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

app.get('/tasks', (req, res) => {
  const all_tasks = db.prepare("SELECT * FROM tasks").all()
    res.status(200).json(all_tasks) 
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = db.prepare("SELECT * FROM tasks WHERE id= ?").get(req.params.id);
  if (!task) {
    return res.status(404).json({ error: `Task ${id} not available /found` });
  }

  res.status(200).json(task);
});


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