import { Router } from "express";

import { availableslot, Book, cancelBooking, createUser, getAllBooking, getUserData, updateProfile, userBooking } from "../controller/user";
import { LoginUser } from "../controller/user";
import { userauth } from "../middleware/auth";

export const userRouter=Router();


userRouter.post("/signup",createUser);
userRouter.post("/login",LoginUser);

userRouter.post("/profile",getUserData);
userRouter.patch("/update-profile",updateProfile);

userRouter.get("/bookings/:id",getAllBooking); //is route ko hata hai mtach with userBooking
userRouter.post("/book",Book);

userRouter.get("/allbooking/:id",userBooking);
userRouter.delete("/cancel-booking/:booking_id",cancelBooking);

userRouter.post("/checkslot",userauth,availableslot);

