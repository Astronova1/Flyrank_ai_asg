import express from 'express'
import supabase from '../lib/supabase.js'
import requireAuth from '../middleware/reqAuth.js'

const router = express.Router()

router.post('/signup', async(req, res) =>{
    const {email, password} = req.body

    if (!email || !password){
        return res.status(400).json({error: "Please enter a valid email and password"})
    }

    const { data, error } = await supabase.auth.signUp({
        email, password,
    })

    if (error){
        return res.status(401).json({error: error.message})
    }

    res.status(201).json({user: data.user})
})

router.post('/login', async(req,res)=>{
    const {email, password} = req.body

        if (!email || !password){
        return res.status(400).json({error: "Please enter a valid email and password"})
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,password,
    })

    if (error){
        return res.status(401).json({error: error.message})
    }
    res.status(200).json({
            JWT_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            user: data.user
        }
    )
})

router.post('/signout', requireAuth, async(req,res) =>{
    const {error} = await supabase.auth.signOut({scope: "local"})
    if(error){
        console.warn('Logout warning', error.message)
    }

    res.status(200).send()
})


export default router