import express, { json } from "express"
import morgan from "morgan"
import cors from "cors"
import { connect } from "mongoose"
import "dotenv/config"
import envs from "env-var"
import { initUserService } from "./routes/user.routes"
import { initIncidencesService } from "./routes/incidences.routes"


export const Enviroments = {
    MONGO: envs.get("MONGODB_URI").required().asUrlString(),
    JWT_SECRET: envs.get("JWT_SECRET").required().asString()
}

const app = express()

app.use(json())
app.use(morgan("dev"))
app.use(cors())

app.use("/api", initUserService())
app.use("/api", initIncidencesService())

const initMongoService = async () => {
    try {


        await connect(Enviroments.MONGO)
        console.log("mongo service running!!!");


    } catch (error) {
        throw new Error(`${error}`);

    }
}

initMongoService()

app.listen(3000, () => {
    console.log("server running in http://localhost:3000");

})