import { Router } from "express";
import { vendor_emp_Login, vendor_emp_Signup,userBooking,allBooking,approveBooking,rejectBooking, checkIn, checkOut } from "../controller/vendor_emp";



export const vendor_emp_router=Router();


vendor_emp_router.post("/signup",vendor_emp_Signup);
vendor_emp_router.post("/login",vendor_emp_Login);

vendor_emp_router.get("/all-bookings",allBooking);
vendor_emp_router.get("/all-user",userBooking)

vendor_emp_router.post("/approve-booking/:id",approveBooking);
vendor_emp_router.post("/reject-booking/:id",rejectBooking);

vendor_emp_router.post("/check-in/:id",checkIn);
vendor_emp_router.post("/check-out/:id",checkOut);


