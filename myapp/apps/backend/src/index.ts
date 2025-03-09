import  express  from "express";
import { userRouter } from "./routes/userRoutes";
import { adminRouter } from "./routes/adminRoutes";
import { vendor_emp_router } from "./routes/vendor_emp_Route";
import { vendor_parker_router } from "./routes/vendor_parker_Routes";
import { Booking_router } from "./routes/booking_Route";
const PORT=process.env.PORT;
export const app=express();


app.use(express.json());



app.use("/user",userRouter);
app.use("/admin",adminRouter)
app.use("/vendoremp",vendor_emp_router)
app.use("/vendorparker",vendor_parker_router)
app.use("/booking",Booking_router)







