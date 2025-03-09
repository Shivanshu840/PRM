import { Prisma } from "@prisma/client";
export enum Parking_Type {
  Two_Wheeler = "Two_Wheeler",
  Four_Wheeler = "Four_Wheeler",
}

export enum Booking_type {
  Parking = "Parking",
  Cab = "Cab",
  Metro = "Metro",
  BikeRide = "BikeRide",
}

export enum Booked_Status {
  pending,
  approved,
  rejected
}


export enum authRole {
  Admin,
  User,
  Shuttle_User,
  Parking_User,
  Payment_Handler
}

// User Interface (Only Required Fields)
export interface UserType {
  FirstName: string;
  LastName: string;
  MiddleName: string;
  Email: string;
  Password: string;
  Age: number;
}

// Admin Interface (Only Required Fields)
export interface AdminType {
  FirstName: string;
  LastName: string;
  MiddleName:string;
  Email: string;
  Password: string;
}

// Vendor Employee Interface (Only Required Fields)
export interface Vendor_Emp_Type {
  FirstName: string;
  LastName: string;
  MiddleName: string;
  Email: string;
  Password: string;
}

// Vendor Parker Interface (Only Required Fields)
export interface Vendor_Parker_Type {
  FirstName: string;
  LastName: string;
  Email: string;
  MiddleName:string;
  Password: string;
  Location: string
}

// Booking Interface (Only Required Fields)
export interface BookingTypes {
  From: string;
  To: string;
  Date: Date;
  PType: Parking_Type;
  Booking_Type: Booking_type;
  Vehcile_No: string;
  User_id: string;
}
