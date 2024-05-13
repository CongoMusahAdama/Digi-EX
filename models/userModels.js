//name, email, password, profileImage and isAdmin
import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required:[true, "Please provide a name"],
        },

        email:{
            type:String,
            required:["Please provide an email"],
        },

        password:{
            type:String,
        },

        profileImage:{
            type:String,
        },

        isAdmin:{
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true
    }

);

export default mongoose.model("User", userSchema);

