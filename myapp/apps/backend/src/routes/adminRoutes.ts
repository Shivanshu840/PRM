import { Router } from "express";
import { allBooking, allUser, allVendor, createNewEmp, createNewParker, LoginAdmin, removeEmp, removeParker, signUpAdmin, updateslot } from "../controller/admin";
import { adminauth } from "../middleware/auth";


export const adminRouter=Router();

adminRouter.post("/signup",signUpAdmin);
adminRouter.post("/login",LoginAdmin);

adminRouter.post("/updateslot",adminauth,updateslot);
adminRouter.post("/create_emp",createNewEmp);

adminRouter.post("/create_parker",createNewParker);
adminRouter.get("/all-users",allUser);

adminRouter.get("/all-bookings",allBooking);
adminRouter.get("/all-vendors",allVendor);

adminRouter.delete("/remove-emp/:id",removeEmp);
adminRouter.delete("/remove-parker/:id",removeParker)




