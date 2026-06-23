import type { IUser } from "../user/user.interface.js";
import bcrypt from "bcryptjs";
import { pool } from "../../db/index.js"
import config from "../../config/index.js";

import jwt, { type JwtPayload } from "jsonwebtoken";

const createUserInDB = async(payload: IUser)=>{
    const {name, email, password, role} = payload;
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(`
    INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, COALESCE($4, 'contributor')) RETURNING  *
    `,[name, email, hashPassword, role]);

    delete result.rows[0].password;

    return result;
}


const loginUserIntoDB = async(payload: {email:string, password: string})=>{
    const {email, password} = payload;

    // 1. Check if user exists

    const userData = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if(userData.rows.length === 0){
        throw new Error("Invalid username or password");
    }
    
    const user = userData.rows[0];

    
    // 2. Compare passwords
    const matchPassword = await bcrypt.compare(password, user.password);
    
    if(!matchPassword){
        throw new Error("Invalid username or password");
    }

    // 3. Generate token
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
    const token = jwt.sign(jwtPayload, config.secret as string, {expiresIn: "1d",})

   

    delete user.password
    return {token, user};



    
}

export const authService = {
    createUserInDB, loginUserIntoDB
}