require('dotenv').config()
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_KEY
const { createClient } = require('@supabase/supabase-js');

app.use(express.json());
const supabase = createClient(url,key)


app.listen(port, () => {
  console.log(`Connected to the supabase server and listening`)
});