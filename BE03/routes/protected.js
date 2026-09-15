import express from 'express'
import extractToken from '../middleware/reqAuth.js'
const router = express.Router()

router.get('/profile', extractToken, (req, res) => {
  console.log(req.token); 
  
  res.status(200).json({ token_received: req.token.slice(0, 10) + '...' });
});

export default router