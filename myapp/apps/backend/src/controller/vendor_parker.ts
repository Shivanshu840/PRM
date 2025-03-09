import { prisma } from "@repo/db/clients";
import { Vendor_Parker_Type } from "../interface";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../middleware/auth";


export const vendor_parker_signup=async(req:any,res:any)=>{
    const data:Vendor_Parker_Type=req.body;

    try{

        const response=await prisma.vendor_Paker.create({
            data:{
                FirstName:data.FirstName,
                MiddleName:data.MiddleName,
                LastName:data.LastName,
                Email:data.Email,
                Password:data.Password
            },
            select:{
                Vendorp_id:true   
            }
        })
        console.log(`vendor parker id ${response.Vendorp_id}`);
        return res.status(200).json({msg:"new vendore parker created"});


    }catch(err){
        return res.status(402).json({msg:"error in createing new vendor parker"});

    }

}


export const vendor_parker_login=async(req:any,res:any)=>{
    const data:Vendor_Parker_Type=req.body;

    try{
        const response=await prisma.vendor_Paker.findFirst({
            where:{
                Email:data.Email,
                Password:data.Password
            },
            select:{
                Vendorp_id:true
            }
        });
        const token=jwt.sign({Vendorp_id:response?.Vendorp_id},JWT_SECRET)
        console.log(`login succesfull ${response?.Vendorp_id}`);
        return res.status(200).json({msg:"login succesfull",token:token})

    }catch(err){
        return res.status(402).json({msg:"error in login the vendor parker"});

    }
}


export const updateCharges=async(req:any,res:any)=>{
    const {Vendorp_id,newcharge}=req.body;

    try{
        const vendor=await prisma.vendor_Paker.findUnique({
            where:{
                Vendorp_id:Vendorp_id
            }
        })
        if(!vendor){
            return res.status(404).json({msg:"vendor not found"});
        }
        await prisma.vendor_Paker.update({
            where:{
                Vendorp_id:Vendorp_id
            },
            data:{
                Charges:newcharge
            }
        })

        return res.status(200).json({msg:"new charges updated"})


    }catch(err){
        return res.status(500).json({msg:"error in updating the new charges"});

    }
}

export const updateSpot=async(req:any,res:any)=>{
    const {Vendorp_id,newLocation,area}=req.body;
    try{
        const vendor=await prisma.vendor_Paker.findUnique({
            where:{
                Vendorp_id:Vendorp_id
            }
        })
        if(!vendor){
            return res.status(404).json({msg:"vendor not found"})
        }

        await prisma.vendor_Paker.update({
            where:{
                Vendorp_id:Vendorp_id
            },
            data:{
                Location:newLocation,
                Area:area
            }
        })
        return res.status(200).json({msg:"new area and location updated successfull"})

    }catch(err){
        return res.status(500).json({msg:"error in updating the area and location"});


    }

}

export const removeSpot=async(req:any,res:any)=>{

    const Vendorp_id=req.params.id;
    try{
        const vendor=await prisma.vendor_Paker.findUnique({
            where:{
                Vendorp_id:Vendorp_id
            }
        })
        if(!vendor){
            return res.status(404).json({msg:"vendor not found"});
        }
        await prisma.vendor_Paker.update({
            where:{
                Vendorp_id:Vendorp_id
            },
            data:{
                Area:null,
                Location:""

            }
        })
        return res.status(200).json({msg:"removed the area and location"})

    }catch(err){
        return res.status(500).json({msg:"Error in removing the parking spot"})
    }

}