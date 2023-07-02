import { createNewUser, checkEmail } from "../models/userCreation.js";

export const newUserHandler = async (req, res) =>{
    const email  = req.body.email
    const pwd  = req.body.password
    try{
        if(email && pwd){
            let result = await checkEmail(email)
            if(!result.valid){
                res.status(409).json({message:result.message})
            }else{
                result = await createNewUser(email, pwd)
                if(result.status == 200){
                    res.status(200).json({message:"User created successfully"})
                }
            }
        }else{
            res.status(400).json({message:"Missing email and/or password"})
        }
    }catch(error){
        res.status(500).json({error:error.message})
    }
}