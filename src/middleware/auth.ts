import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken"
import config from "../config/index.js";
import { pool } from "../db/index.js";
import type { ROLES } from "../types/index.js";



const auth = (...roles: ROLES[]) =>{
    
    return async (req: Request, res: Response, next: NextFunction)=>{
    console.log(roles)
        try {

        //console.log(req.headers.authorization);




    // 1. check if the token exists
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({
        success : false,
        message: "Unauthorized access",
        data: {}
    })
    }

    // 2. Verify the token
    const decoded = jwt.verify(token as string, config.secret as string) as JwtPayload;

    const userData = await pool.query(`SELECT * FROM users where email = $1`, [decoded.email])

    //console.log(userData)
    console.log(userData)

    // 3. Find user in database
    const user = userData.rows[0];
    if(userData.rows.length === 0){
        res.status(404).json({
        success : false,
        message: "User not found",
        data: {}
    })
    }



    if(roles.length && !roles.includes(user.role)){
        res.status(403).json({
        success : false,
        message: "Forbidden",
        data: {}
    })
    }


    req.user = decoded;
    next();
        
    } catch (error) {
        next(error)
    }
}
}


export default auth