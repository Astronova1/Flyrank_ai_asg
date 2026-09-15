const requireAuth = async (req,res,next) =>{
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({"error": "Access token Required"})
        }

        const token = authHeader.split(' ')[1]

        if (!token)
        {
            return res.status(401).json({"error": "Access token required"})
        }

        req.token = token
}

export default requireAuth