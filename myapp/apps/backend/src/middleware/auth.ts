import { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET="password"


export const userauth=async(req:any,res:any,next:NextFunction)=>{
    
    const token = req.header('Authorization')?.replace('Bearer ','');
    if(!token){
        return res.status(403).json({msg:"authentication failed"});
    }

    const validate=jwt.verify(token,JWT_SECRET);
    if(validate){
        // return res.status(403).json({msg:"valid user"});
        next();
    }else{
        return res.status(402).json({mag:"invalid token"});
    }
}

export const adminauth=async(req:any,res:any,next:NextFunction)=>{
    const token=req.header('Authorization')?.replace('Bearer ','');

    if(!token){
        return res.status(403).json({msg:"authorization failed"});
    }
    const validate=jwt.verify(token,JWT_SECRET);

    if(validate){
        next();
    }else{
        return res.status(403).json({msg:"invalid token"});
    }

}