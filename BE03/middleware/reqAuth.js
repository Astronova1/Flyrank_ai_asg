import supabase from "../lib/supabase.js"

const requireAuth = async (req,res,next) =>{
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({"error": "Access token Required"})
        }

        const token = authHeader.split(' ')[1]

        if (!token)
        {
            return res.status(401).json({"error": "Access token required"})
        }

        const {data: {user},error} = await supabase.auth.getUser(token) 
        if (error || !user){
            return res.status(401).json({"error": "Invalid or Expired Token"})
        }
        req.user = user
        req.token = token
        next()
}

export default requireAuth