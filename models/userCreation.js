import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config()

export async function createNewUser(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const id = uuidv4();
    const timestamp = Date.now().toString();
    const payload = {
      table: "users",
      data: {
        id: { S: id },
        active: { BOOL: false },
        email: { S: email },
        password: { S: hashedPassword },
        timestamp: { N: timestamp }
      }
    };

    const dbApi = process.env.DB_API;
    const apiUrl = `${dbApi}/api/db/write`;
    const response = await axios.post(apiUrl, payload);
    return response;
  } catch (error) {
    console.error("❌ - Error in function createNewUser:", error);
    throw error;
  }
}

export async function checkEmail(email) {
  try {
    // Check if it is a valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(email);

    if (!isEmailValid) {
      return { valid: false, message: "Email is not valid." };
    }

    // Check if the new user already exists
    const dbApi = process.env.DB_API;
    const apiUrl = `${dbApi}/api/db/read`;

    // DynamoDB params for search
    const payload = {
      TableName: "users",
      FilterExpression: "email = :field",
      ExpressionAttributeValues: {
        ":field": { S: email }
      }
    };

    const response = await axios.get(apiUrl, { params: payload });
    const total = response.data.Count;
    
    if (total >= 1) {
      return { valid: false, message: "User already exists." };
    }

    return { valid: true };
  } catch (error) {
    console.error("❌ - Error in function checkEmail:", error.response.data.error);
    throw error;
  }
}