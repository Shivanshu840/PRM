import { Router } from "express";
import { Book_slot } from "../controller/booking";
import { cancelBooking } from "../controller/booking";


export const Booking_router=Router();


Booking_router.post("/book",Book_slot);

Booking_router.post("/cancel",cancelBooking)