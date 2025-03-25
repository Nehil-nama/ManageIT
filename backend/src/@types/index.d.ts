import mongoose from "mongoose";

declare global {
    namespace Express {
        interface User extends UserDocument {
            _id?: any;
            currentWorkspace?: mongoose.Types.ObjectId | null;        
        }
    }
}