
import { prisma } from "@repo/db/clients";

import jwt from "jsonwebtoken";
import { BookingTypes, UserType } from "../interface";
import { JWT_SECRET } from "../middleware/auth";


export  const createUser = async (req:any,res:any)=>{
  const userdata:UserType=req.body;
  console.log(userdata);

  try{
    const response=await prisma.user.create({
        data:{
            FirstName:userdata.FirstName,
            LastName:userdata.LastName,
            MiddleName:userdata.MiddleName,
            Email:userdata.Email,
            Age:userdata.Age,
            Password:userdata.Password   
        },
        select:{
          User_id:true
        }
    })
    console.log(`user created ${response.User_id}`);
    return res.status(200).json({msg:"user createde successfull"});

  }catch(err){
    return res.status(401).json({msg:"enter valid input/"})
  }
};

export const LoginUser=async(req:any,res:any)=>{
  const data:UserType=req.body


  console.log("user-> ",data);
  try{
    const response=await prisma.user.findFirst({
      where:{
        Email:data.Email,
        Password:data.Password

      },
      select:{
        User_id:true
      }
    })
    if(response){

      
      
      
    }
    if(response){
      const token=jwt.sign({User_id:response.User_id},JWT_SECRET);
      return res.status(200).json({msg:"Login successfull",token:token});
    }

  }catch(err){
    return res.status(402).json({msg:"invalid user not found"})
    
  }

}

// user details lene ka route bana dete hai pahle

export const getUserData=async(req:any,res:any)=>{
  const {Email,Password}=req.body;
  console.log(`${Email},${Password}`)
  try{
    const response=await prisma.user.findUnique({
      where:{
        Email:Email,
        Password:Password
      }
    })
    if(!response){
      return res.status(402).json({msg:"user not found"});

    }
    
    return res.status(200).json({msg:"User all data is ",user:response});

  }catch(err){
    return res.status(500).json({msg:"error in fetching the details",err})
    

  }

}


export const updateProfile=async(req:any,res:any)=>{
  const data:UserType=req.body.data;
  const User_id=req.body.User_id;
  try{

    const response=await prisma.user.update({
      where:{
        User_id:User_id

      },
      data:{
        FirstName:data.FirstName,
        MiddleName:data.MiddleName,
        LastName:data.LastName,
        Email:data.Email,
        Age:data.Age,
        Password:data.Password,
      },
      select:{
        User_id:true
      }
    })
    return res.status(200).json({msg:"update the user profile",User_id:response.User_id});

  }catch(err){
    return res.status(400).json({msg:"not able to update the user profile"})

  }
}

export const userBooking=async(req:any,res:any)=>{
  const User_id=req.params.User_id;

  try{
    const response=await prisma.user.findUnique({
      where:{
        User_id:User_id
      },
      select:{
        Bookings:{
          select:{
            Booking_ID:true,
            From:true,
            To:true,
            Date:true,
            PType:true,
            Booking_Type:true,
            managedBy:true,
            Booking_Status:true

          }
        }
      }
    })
    return res.status(200).json({msg:"The booking data is as follows",Booking:response});

  }catch(err){
    return res.status(400).json({msg:"error in fetching the booking details"});

  }

}

export const getAllBooking=async(req:any,res:any)=>{
  const User_id:any=req.params.id;
  console.log(User_id);
  if(!User_id){
    return res.status(400).json({msg:"User_id not found"});
  }

  try{
    const response = await prisma.user.findUnique({
      where: {
        User_id: User_id, 
      },
      select: {
        FirstName: true,
        LastName: true,
        Email: true,
        Bookings: {
          select: {
            Booking_ID: true,
            From: true,
            To: true,
            Date: true,
            PType: true,
            Payment: true,
            Payment_Status: true,
            Booking_Status: true,
            Booking_Type: true,
            Vehcile_No: true,
          },
        },
      },
    });
    return res.status(200).json({msg:"All booking details are",response});

  }catch(err){
    return res.status(500).json({msg:"error in getting the booking details"});

  }


}

export const userPayment=async(req:any,res:any)=>{
  
}

export const Book=async(req:any,res:any)=>{
  const data:BookingTypes=req.body.data;
  const User_id=req.body.User_id;
  console.log(data);
  console.log(User_id);

  try{
    const user=await prisma.user.findUnique({
      where:{
        User_id:User_id
      },
    })
    if(!user){
      return res.status(400).json({msg:"user not found"});
    }
    const bookresponse=await prisma.booking.create({
      data:{
        From:data.From,
        To:data.To,
        Date:data.Date,
        PType:data.PType,
        Booking_Type:data.Booking_Type,
        User_id:User_id,
        Vehcile_No:data.Vehcile_No,
        
      },
      select:{
        Booking_ID:true
      }
    })
    return res.status(200).json({msg:"Booking succesfull",Booking_id:bookresponse})

  }catch(err){
    return res.status(400).json({msg:"Error in booking the service",err});
  }
}

export const availableslot=async(req:any,res:any)=>{
  // in this funciton only i have to fetch the free slot near the user
}


export const cancelBooking=async (req:any,res:any)=>{
  const booking_id=req.params.booking_id;
  console.log(booking_id)
  try{
    const response=await prisma.booking.delete({
      where:{
        Booking_ID:booking_id
      }
    })
    
    return res.status(200).json({msg:`Booking ${booking_id} canceled succesfull`});
  }catch(err){
    return res.status(400).json({msg:"error in canceling the booking"});
  }
}








