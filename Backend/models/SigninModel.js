import mongoose from 'mongoose';
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        trim:true,
        minlenghth:[3,'Name must be 2 character long'],},
    email:{
        type:String,
        required:[true,'email is required'],
        trim:true,
        unique:true,
        match:[/^\S+@\S+\.\S+$/, 'Please use a valid email address'],

        },
    password:{
        type:String,
        required:true,
        minlength:[6,'Password must be 6 character long'],
    },
    role:{
        type:String,
        enum:['user','admin'],
        required:true,

    },
    CreatedAt:{
        type:Date,
        default:Date.now,
    },
    UpdatedAt:{
        type:Date,
        default:Date.now,
    }

}
);
const userModel =mongoose.model('user',userSchema);
export default userModel;