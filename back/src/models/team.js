import mongoose from "mongoose";


const Team = mongoose.Schema({
    teamName : {
        type : String,
        required : true,
        unique : true
    },
    teamImage : {
        type : String
    }
})

const TeamModel = mongoose.model("Team", Team);

export default TeamModel;
