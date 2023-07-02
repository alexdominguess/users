import { createNewUser, checkEmail } from "../models/userCreation.js";

export const newUserHandler = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Missing email and/or password" });
    }
  
    try {
      const result = await checkEmail(email);
      if (!result.valid) {
        return res.status(409).json({ message: result.message });
      }
  
      const createUserResult = await createNewUser(email, password);
      if (createUserResult.status === 200) {
        return res.status(200).json({ message: "User created successfully" });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  