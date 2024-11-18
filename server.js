process.on('uncaughtException', (err) => {
  console.log("UnhandledException 💥");
  console.log(err.name, err.message, err.stack);
    process.exit(1);
})
const dotenv=require("dotenv")
dotenv.config()
const app =require('./app')
const mongoose = require("mongoose")


const password=process.env.DB_PASSWORD
let connection_string=process.env.CON_STRING
connection_string=connection_string.replace('<password>',password)
  

mongoose
.connect(process.env.Local_CON_STRING, {  })
.then(() => {
  console.log('DB connection successful!')
  const port = process.env.PORT || 5000;
  const server= app.listen(port, () => {
    console.log(`App running on port localhost:5000/ ${port}...`);
    // process.on('unhandledRejection', (err) => {
    //   console.log("unhandledRejection 💥💥💥💥")
    //   console.log(err.name, err.message);
    //   server.close(() => {
    //     process.exit(1);
    //   });
    // })
  })

})

