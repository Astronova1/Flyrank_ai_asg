import 'dotenv/config'
import express from 'express'
import supabase from './lib/supabase.js'
import authRouter from './routes/auth.js'
import publicRouter from './routes/public.js'
import protectedRouter from './routes/protected.js'
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.js';


const app = express()
const port = process.env.PORT || 3000
app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRouter)
app.use('/public', publicRouter);
app.use('/protected', protectedRouter);

app.listen(port, () => {
  console.log(`Connected to the supabase server and listening`)
});