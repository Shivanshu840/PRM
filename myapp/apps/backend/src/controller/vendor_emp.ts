import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../middleware/auth"
import { prisma } from "@repo/db/clients"
import { Vendor_Emp_Type } from "../interface"


export const vendor_emp_Signup=async (req:any,res:any)=>{

    const data:Vendor_Emp_Type=req.body;

    try{

        const response=await prisma.vendor_EMP.create({
            data:{
                FirstName:data.FirstName,
                MiddleName:data.MiddleName,
                LastName:data.LastName,
                Email:data.Email,
                Password:data.Password     
            },
            select:{
                Emp_id:true
            }
        })
        
        console.log(`vendor emp -> ${response.Emp_id}`);
        return res.status(200).json({msg:"new vendor emp created"});

    }catch(err){
        return res.status(402).json({msg:"error in created new vendor emp",err})

    }



}

export const vendor_emp_Login=async(req:any,res:any)=>{
    const data=req.body;

    try{
        const response=await prisma.vendor_EMP.findFirst({
            where:{
                Email:data.Email,
                Password:data.password

            },
            select:{
                Emp_id:true
            }
        })
        const token=jwt.sign({Emp_id:response?.Emp_id},JWT_SECRET);
        console.log(`vendr is ${response?.Emp_id}`);
        return res.status(200).json({msg:"Login sucessfull",token:token});

    }catch(err){
        return res.status(402).json({msg:"error in login vendor emp"})
        
    }
}


// GET	/vendor-emp/all-bookings	Get all bookings under management
// GET	/vendor-emp/user-bookings/:userId	Get bookings for a specific user


export const allBooking=async(req:any,res:any)=>{

    try{
        const response=await prisma.booking.findMany({});
        return res.status(200).json({msg:"Booking data ",Booking:response});

    }catch(err){
        return res.status(402).json({msg:"error in getting the booking details"});

    }

}

export const userBooking=async(req:any,res:any)=>{
    const User_id=req.params.id;

    try{
        const user=await prisma.booking.findMany({
            where:{
                User_id:User_id
            }
        })
        if(!user){
            return res.status(402).json({msg:"user not exist"});
        }
        const response=await prisma.booking.findMany({
            where:{
                User_id:User_id
            }

        })
        return res.status(200).json({msg:"Userbokking details",Booking:response})

    }catch(err){
        return res.status(402).json({msg:"error in getting the booking details"});

    }
}

// PATCH	/vendor-emp/approve-booking/:bookingId	Approve a booking request
// PATCH	/vendor-emp/reject-booking/:bookingId	Reject a booking request


export const approveBooking=async(req:any,res:any)=>{
    const Booking_id=req.params.id;
    
    try{
        const response=await prisma.booking.update({
                where:{
                    Booking_ID:Booking_id
                },
                data:{
                    Booking_Status:"approved"
                }

        })
        return res.status(200).json({msg:`Booking ${Booking_id} approved`});

    }catch(err){
        return res.status(402).json({msg:"error in approving the booking"})

    }
}

export const rejectBooking=async(req:any,res:any)=>{
    const Booking_id=req.params.id;

    try{
        const response=await prisma.booking.update({
            where:{
                Booking_ID:Booking_id,
            },
            data:{
                Booking_Status:"rejected"
            }
        })
        return res.status(200).json({msg:`Booking ${Booking_id} rejected`});

    }catch(err){
        return res.status(402).json({msg:"error in rejecting the booking status"});

    }
}

// check in route
// check out route

export const checkIn=async(req:any,res:any)=>{
    const Booking_id=req.params.id;

    try{
        const booking=await prisma.booking.findUnique({
            where:{
                Booking_ID:Booking_id
            },
            select:{
                Booking_Status:true
            }
        })
        if(!booking){
            return res.status(404).json({msg:"Booking not found"})
        }
        if(booking.Booking_Status!=="approved"){
            return res.status(403).json({msg:"booking status not approved"});
        }

        const response=await prisma.booking.update({
            where:{
                Booking_ID:Booking_id
            },
            data:{
                CheckIn:new Date()
            },
            select:{
                User_id:true
            }
        })

        const User_id=response.User_id
        await prisma.user.update({
            where:{
                User_id:User_id
            },
            data:{
                CheckIn:new Date()

            }
        })
        return res.status(200).json({msg:"check in time updated"});

    }catch(err){
        return res.status(500).json({msg:"error in updating the checik in time"})
        
    }
}

export const checkOut=async(req:any,res:any)=>{
    const Booking_id=req.params.id;
    try{
        const booking=await prisma.booking.findUnique({
            where:{
                Booking_ID:Booking_id
            },
            select:{
                Booking_Status:true,
                CheckIn:true
            }
        })

        if(!booking){
            return res.status(404).json({msg:"Booking not found"});
        }
        if(booking.Booking_Status!=="approved" || booking.CheckIn==null){
            return res.status(403).json({msg:"Booking not active"});

        }
        const response=await prisma.booking.update({
            where:{
                Booking_ID:Booking_id
            },
            data:{
                CheckOut:new Date()
            },
            select:{
                User_id:true
            }
        })
        const User_id=response.User_id
        await prisma.user.update({
            where:{
                User_id:User_id
            },
            data:{
                CheckOut:new Date()

            }
        })
        return res.status(200).json({msg:"check out time updated"});

    }catch(err){
        return res.status(402).json({msg:"error in updaing the check out time"});

    }
}