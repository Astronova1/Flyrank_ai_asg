import express from 'express'
import requireAuth from '../middleware/reqAuth.js'
const router = express.Router()

router.get('/profile', requireAuth, (req, res) => {  
  res.status(200).json({  
    id: req.user.id,
    email: req.user.email,
    created_at: req.user.created_at});
});

export default router