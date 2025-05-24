import { model, Schema } from "mongoose";
import { Incidences } from "../interfaces/Incidences.interface";

const SchemaInsidences = new Schema<Incidences>({
    title : {
        type : String,
        required : true
    },

    description : {
        type : String,
        required : true
    },

    priority : {
        type : String,
        required : true
    },

    date : {
        type : Date,
        required : true
    },

    status : {
        type : String,
        required : true
    },

    userReport :  {
        type : String,
        required : true
    }
})

export const ModelInsidences = model("incidences", SchemaInsidences)