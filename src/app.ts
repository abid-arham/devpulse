import express, { type Application, type Request, type Response } from "express"
import { authRoute } from "./modules/auth/auth.routes.js";
import { issueRoute } from "./modules/issues/issues.routes.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";


const app : Application = express()
const port = process.env.port

app.use(express.json());


app.get("/", (req: Request, res: Response)=>{
    res.status(200).json({
        "message": "Assignment Home Route",
        "author": "me",

    })
});

app.use("/api/auth", authRoute)
app.use("/api/issues", issueRoute)


app.use(globalErrorHandler)

export default app