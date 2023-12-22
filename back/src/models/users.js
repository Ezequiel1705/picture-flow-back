import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {type: String, required : true},
    name : {
        type : String,
    },
    lastName : {
        type : String
    },
    description : {
        type : String
    },
    avatar : {
        type : String
    },
    email: {type: String, required: true},
    password: {type: String, required: true },
    saves : [
       {
         pinId : {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Publication"
         }
       }
    ]
});


const User = mongoose.model("User", userSchema);

export default User;