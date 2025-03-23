import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "../config/database.config";
import RoleModel from "../models/roles-permission.model";
import { RolePermissions } from "../utils/roles-permissiom";

const seedRoles = async () => {
    console.log('Seeding roles started...');

    try {
        await connectDatabase();

        const session = await mongoose.startSession();
        session.startTransaction();

        console.log("Clearing existing roles...");
        await RoleModel.deleteMany({}, { session });

        for(const roleName in RolePermissions) {
            const role = roleName as keyof typeof RolePermissions;
            const rolePermission = RolePermissions[role];

            const existingRole = await RoleModel.findOne({ name: role }).session(session);
            if(!existingRole) {
                const newRole = new RoleModel({
                    name: role,
                    permissions: rolePermission,
                });
                await newRole.save({ session });
                console.log(`Role ${role} added with permission. `);
            } else{
                console.log(`Role ${role} already exists.`);
            }
        } 

        await session.commitTransaction();
        console.log('Transaction completed.');

        session.endSession();
        console.log('session ended.');

        console.log("seeding completed successfully.");
    } catch (error) {
        console.error("Error during seeding: ", error);
    }
};

seedRoles().catch((error) => 
    console.error("Error running seed script: ", error)
);