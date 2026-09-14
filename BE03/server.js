import 'dotenv/config'
import express from 'express'
import supabase from './lib/supabase.js'

const app = express()
const port = process.env.PORT || 3000
app.use(express.json());


app.listen(port, () => {
  console.log(`Connected to the supabase server and listening`)
});