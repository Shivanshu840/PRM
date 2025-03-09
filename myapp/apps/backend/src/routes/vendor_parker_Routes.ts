import { Router } from "express";
import { removeSpot, updateCharges, updateSpot, vendor_parker_login, vendor_parker_signup } from "../controller/vendor_parker";

export const vendor_parker_router=Router();


vendor_parker_router.post("/signup",vendor_parker_signup);
vendor_parker_router.post("/login",vendor_parker_login);


// DELETE	/vendor-parker/remove-parking/:parkingId	Remove a parking slot
// PATCH	/vendor-parker/update-charges/:parkingId	Update parking charges

vendor_parker_router.patch("/update-charges",updateCharges);
vendor_parker_router.delete("/remove-parking-spot/:id",removeSpot);

vendor_parker_router.post("/update-spot",updateSpot);