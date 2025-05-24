import { model, Schema } from "mongoose";
import { User } from "../interfaces/User.interface";



const SchemaUser = new Schema<User>({

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    }

})



export const ModelUser = model("users", SchemaUser)