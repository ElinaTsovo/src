// import mongoose
import {Schema, model} from "mongoose";

const dataSchema = new Schema({
    name:{
        type: String,
        required: true,

        
    },
    
    email:{
        type: String,
        unique: true,
        required: true
    },

    password:{
        type: String,
        required: true
    }


}, {timestamps:true})

export const data = model('usuatio', dataSchema)

