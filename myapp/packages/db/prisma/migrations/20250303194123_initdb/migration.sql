-- CreateEnum
CREATE TYPE "authRole" AS ENUM ('Admin', 'User', 'Shuttle_User', 'Parking_User', 'Payment_Handler');

-- CreateEnum
CREATE TYPE "Parking_Type" AS ENUM ('Two_Wheeler', 'Four_Wheeler');

-- CreateEnum
CREATE TYPE "Booking_type" AS ENUM ('Parking', 'Cab', 'Metro', 'BikeRide');

-- CreateEnum
CREATE TYPE "Booked_Status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "User" (
    "User_id" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "MiddleName" TEXT,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Age" INTEGER NOT NULL,
    "Phone" VARCHAR(10),
    "Location" TEXT,
    "CheckIn" TIMESTAMP(3),
    "CheckOut" TIMESTAMP(3),
    "Role" "authRole" NOT NULL DEFAULT 'User',
    "managedById" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("User_id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "Booking_ID" TEXT NOT NULL,
    "From" TEXT NOT NULL,
    "To" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "PType" "Parking_Type" NOT NULL,
    "Payment" INTEGER,
    "Payment_Status" BOOLEAN DEFAULT false,
    "Booking_Status" "Booked_Status" DEFAULT 'pending',
    "Booking_Type" "Booking_type" NOT NULL,
    "Vehcile_No" TEXT NOT NULL,
    "User_id" TEXT NOT NULL,
    "managedById" TEXT,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("Booking_ID")
);

-- CreateTable
CREATE TABLE "Admin" (
    "Admin_id" TEXT NOT NULL,
    "Firstname" TEXT NOT NULL,
    "MiddleName" TEXT,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL DEFAULT 'admin1234',
    "Role" "authRole" NOT NULL DEFAULT 'Admin',

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("Admin_id")
);

-- CreateTable
CREATE TABLE "Vendor_EMP" (
    "Emp_id" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "MiddleName" TEXT,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Salary" INTEGER,
    "adminId" TEXT,

    CONSTRAINT "Vendor_EMP_pkey" PRIMARY KEY ("Emp_id")
);

-- CreateTable
CREATE TABLE "Vendor_Paker" (
    "Vendorp_id" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "MiddleName" TEXT,
    "LastName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL DEFAULT 'vendor1234',
    "Area" INTEGER,
    "Location" TEXT,
    "Charges" INTEGER,
    "Role" "authRole" NOT NULL DEFAULT 'Parking_User',
    "adminId" TEXT,

    CONSTRAINT "Vendor_Paker_pkey" PRIMARY KEY ("Vendorp_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_Email_key" ON "Admin"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_EMP_Email_key" ON "Vendor_EMP"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_Paker_Email_key" ON "Vendor_Paker"("Email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managedById_fkey" FOREIGN KEY ("managedById") REFERENCES "Vendor_EMP"("Emp_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_User_id_fkey" FOREIGN KEY ("User_id") REFERENCES "User"("User_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_managedById_fkey" FOREIGN KEY ("managedById") REFERENCES "Vendor_EMP"("Emp_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor_EMP" ADD CONSTRAINT "Vendor_EMP_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("Admin_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vendor_Paker" ADD CONSTRAINT "Vendor_Paker_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("Admin_id") ON DELETE SET NULL ON UPDATE CASCADE;
