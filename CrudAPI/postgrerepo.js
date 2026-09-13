const { Pool } = require('pg')
const pool = new Pool ({connectionString: process.env.DATABASE_URL})

module.exports={
    async getAll(){
        const {rows} = await pool.query('SELECT * FROM tasks ORDER by id');
        return rows
    },

    async getById(id){
        const {rows} = await pool.query('SELECT * FROM tasks WHERE id= $1',[id])
        return rows[0] || null
    },
    
    async create(title,done){
        const {rows} = await pool.query('INSERT INTO tasks(title,done) VALUES ($1, $2) RETURNING *', [title,done])
        return rows[0]
    },

    async update(id,title,done){
         const { rows } = await pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING *',
      [title, done, id]
    );
    return rows[0] || null;
  },

  async remove(id) {
    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    }
}