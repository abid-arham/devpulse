import dotenv from "dotenv"
import path from "node:path"


dotenv.config({
    path: path.join(process.cwd(), ".env"),

})

const config = {
    connection_string: process.env.DATABASE_URL as string,
    secret: process.env.JWT_SECRET,
    refresh_secret: process.env.REFRESH_SECRET
}

const port = {
    port: process.env.PORT,

}

export default config