const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

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
  res.json(tasks);
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});