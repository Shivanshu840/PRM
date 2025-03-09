1. Admin Routes
Admins should have control over vendor employees, vendor parkers, users, and overall booking management.

Admin API Endpoints
Method	Route	Description
POST	/admin/create-emp	Create a new vendor employee
POST	/admin/create-parker	Create a new vendor parker
GET	/admin/all-users	Get a list of all users
GET	/admin/all-bookings	Get a list of all bookings
GET	/admin/all-vendors	Get a list of vendor employees & parkers
DELETE	/admin/remove-emp/:id	Remove a vendor employee
DELETE	/admin/remove-parker/:id	Remove a vendor parker
PATCH	/admin/update-role/:id	Update the role of a user/vendor

2. User Routes
Users should be able to book parking, cabs, metro, and check booking statuses.

User API Endpoints
Method	Route	Description
GET	/user/profile/:id	Get user details
PATCH	/user/update-profile/:id	Update user details
POST	/user/book	Create a new booking (Parking/Cab/Metro)
GET	/user/bookings/:id	Get user's all bookings
DELETE	/user/cancel-booking/:bookingId	Cancel a booking
PATCH	/user/update-booking/:bookingId	Update booking details
3. Vendor Employee Routes (Parking Spot Managers)
Vendor employees are responsible for handling bookings and managing check-ins/check-outs.

Vendor Employee API Endpoints
Method	Route	Description
GET	/vendor-emp/all-bookings	Get all bookings under management
GET	/vendor-emp/user-bookings/:userId	Get bookings for a specific user
PATCH	/vendor-emp/approve-booking/:bookingId	Approve a booking request
PATCH	/vendor-emp/reject-booking/:bookingId	Reject a booking request
POST	/vendor-emp/check-in/:bookingId	Mark a user’s check-in
POST	/vendor-emp/check-out/:bookingId	Mark a user’s check-out
4. Vendor Parker Routes (Parking Slot Owners)
Vendor parkers manage their parking spaces and set charges.

Vendor Parker API Endpoints
Method	Route	Description
GET	/vendor-parker/all-parking	Get all managed parking slots
POST	/vendor-parker/add-parking	Add a new parking slot
PATCH	/vendor-parker/update-parking/:parkingId	Update parking slot details
DELETE	/vendor-parker/remove-parking/:parkingId	Remove a parking slot
PATCH	/vendor-parker/update-charges/:parkingId	Update parking charges
5. Booking Routes
Booking-related actions such as creating, modifying, and retrieving bookings.

Booking API Endpoints
Method	Route	Description
POST	/booking/create	Create a new booking (Parking/Cab/Metro)
GET	/booking/:bookingId	Get booking details
PATCH	/booking/update/:bookingId	Update booking details
DELETE	/booking/cancel/:bookingId	Cancel a booking
PATCH	/booking/payment/:bookingId	Mark a booking as paid
