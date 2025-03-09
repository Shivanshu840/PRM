import { prisma } from "@repo/db/clients";

import { BookingTypes } from "../interface";

export const Book_slot = async (req: any, res: any) => {
  const data:BookingTypes = req.body;
  console.log(data);

  try {
    const response = await prisma.booking.create({
      data: {
        From: data.From,
        To: data.To,
        Date: new Date(data.Date), 
        PType: data.PType,
        Vehcile_No: data.Vehcile_No,
        User_id: data.User_id,
        Booking_Type: data.Booking_Type,
      },
      select: {
        User_id: true,
        Vehcile_No: true,
        Booking_ID: true,
      },
    });
    console.log(`user ${response.User_id} has booked ${response.Booking_ID}`);
    return res.status(200).json({ msg: "Booking succesfull" });
  } catch (err) {
    return res.status(402).json({ msg: "error in booking", err });
  }
};


export const cancelBooking=async(req:any,res:any)=>{
  return res.json({msg:"hello"});
  
}