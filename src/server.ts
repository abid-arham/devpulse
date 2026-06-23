import app from "./app.js"
import { initDB } from "./db/index.js"


const main = () =>{
    initDB()
    app.listen(process.env.PORT, ()=>{
        console.log(`app,listening on port ${process.env.PORT}`)
    })
}

main()