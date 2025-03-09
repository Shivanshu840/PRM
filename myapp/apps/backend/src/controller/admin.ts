

import {prisma} from "@repo/db/clients"
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../middleware/auth";

import { AdminType, Vendor_Emp_Type, Vendor_Parker_Type } from "../interface"


export const signUpAdmin=async(req:any,res:any)=>{

    const admindata:AdminType=req.body;
    console.log(admindata);

    try{
        const response=await prisma.admin.create({
            data: {
                FirstName:admindata.FirstName,
                LastName:admindata.LastName,
                MiddleName:admindata.MiddleName,
                Email:admindata.Email,
                Password:admindata.Password,
    
            },
            select:{
                Admin_id:true
            }
        })
        console.log(response.Admin_id);
        return res.status(200).json({msg:"admin create succesfull"});
    }catch(err){
        console.log(err);
        return res.status(404).json({msg:"error in create new admin"})

    }

}

export const LoginAdmin=async(req:any,res:any)=>{
    const data:AdminType=req.body;

    try{
        const response=await prisma.admin.findFirst({
            where:{
                Email:data.Email,
                Password:data.Password
            },
            select:{
                Admin_id:true
            }
        })
        const token=jwt.sign({Admin_id:response?.Admin_id},JWT_SECRET);

        return res.status(200).json({msg:`admin ${response?.Admin_id}`,token:token})
        

    }catch(err){
        return res.status(402).json({msg:"invalid credential not admin found"});

    }

}

export const updateslot=async(req:any,res:any)=>{
    return res.status(200).json({msg:"slot free"});
}


export const createNewEmp=async(req:any,res:any)=>{
    const data:Vendor_Emp_Type=req.body;

    try{
        const response=await prisma.vendor_EMP.create({
            data:{
                FirstName:data.FirstName,
                LastName:data.LastName,
                Email:data.Email,
                MiddleName:data.MiddleName,
                Password:data.Password
            },
            select:{
                Emp_id:true
            }
        })
        return res.status(200).json({msg:"new emp created",Emp_id:response.Emp_id});

    }catch(err){
        return res.status(400).json({msg:"error in creating new emp"});

    }
}

export const createNewParker=async(req:any,res:any)=>{
    const data:Vendor_Parker_Type=req.body;

    try{
        const response=await prisma.vendor_Paker.create({
            data:{
                FirstName:data.FirstName,
                LastName:data.LastName,
                Email:data.Email,
                MiddleName:data.MiddleName,
                Password:data.Password,
                Location:data.Location
            },
            select:{
                Vendorp_id:true
            }
        })
        return res.status(200).json({msg:"new vendor parker created",Parker_id:response.Vendorp_id})

    }catch(err){
        return res.status(400).json({msg:"error in creating new parker",err})
;
    }
}


export const allUser=async(req:any,res:any)=>{

    try{
        const response=await prisma.user.findMany({
            select:{
                FirstName:true,
                LastName:true,
                Email:true
            }
        });

        return res.status(200).json({msg:"all user are",User:response});
    }catch(err){
        return res.status(400).json({msg:"error in getting all user"});
    }

}


export const allBooking=async(req:any,res:any)=>{

    try{
        const response=await prisma.booking.findMany({});

        return res.status(200).json({msg:"Booking data",Booking:response});

    }catch(err){
        return res.status(400).json({msg:"Error in getting all the bookings"});

    }
}

export const allVendor=async(req:any,res:any)=>{

    try{

        const response=await prisma.vendor_Paker.findMany({});

        return res.status(200).json({msg:"all Vendor are",Vendor:response});

    }catch(err){
        return res.status(400).json({msg:"error in getting all parker"});

    }
}


export const removeEmp=async(req:any,res:any)=>{
    const Emp_id=req.params.id;

    try{
        const Emp=prisma.vendor_EMP.findUnique({
            where:{
                Emp_id:Emp_id
            }
        })
        if(!Emp){
            return res.status(402).json({msg:"emp not found"});
        }
        const update=await prisma.vendor_EMP.delete({
            where:{
                Emp_id:Emp_id
            }
        })

        return res.status(200).json({msg:"emp deleted succesfull"});

    }catch(err){
        return res.status(402).json({msg:"error in updating the emp table"});

    }
}


export const removeParker=async(req:any,res:any)=>{
    const Parker_id=req.params.id;

    try{
        const Parker=await prisma.vendor_Paker.findUnique({
            where:{
                Vendorp_id:Parker_id
            }
        })
        if(!Parker){
            return res.status(402).json({msg:"parker not found"});
        }
        const update=await prisma.vendor_Paker.delete({
            where:{
                Vendorp_id:Parker_id
            }
        })
        return res.status(200).json({msg:`Vendor parker ${Parker_id} deleted succesfull`});
    }catch(err){
        return res.status(402).json({msg:"Error in deleteing the parker"});
    }
}