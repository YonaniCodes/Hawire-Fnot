const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
const tour = require("../../model/toursModel");
const user = require("../../model/userModel");
const review = require("../../model/reviewModel");

dotenv.config();

const password = process.env.DB_PASSWORD;
let connection_string = process.env.CON_STRING;
connection_string = connection_string.replace('<password>', password);

const importData = async () => {
  try {
    const data1 = await fs.promises.readFile("./tours.json", 'utf-8');
    const data2 = await fs.promises.readFile("./users.json", 'utf-8');
    const data3 = await fs.promises.readFile("./reviews.json", 'utf-8');
    const jsonData1 = JSON.parse(data1);
    const jsonData2 = JSON.parse(data2);
    const jsonData3 = JSON.parse(data3);

    await tour.create(jsonData1);
    await user.create(jsonData2,{validateBeforeSave:false});
    await review.create(jsonData3);


    console.log('Data successfully imported!');
  } catch (err) {
    console.error('Error:', err);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect( "mongodb://127.0.0.1:27017/ecomm", {

    });
    console.log('DB connection successful!');
    if(process.argv[2]==="--import")
      importData()
    else if(process.argv[2]=="--delete")
      deleteData()
 
  } catch (err) {
    console.error('Mongodb not connected', err);
  }
};

const deleteData= async ()=>{
  await tour.deleteMany();
  await user.deleteMany();
  await review.deleteMany();

  console.log("data deleted succesfuly")
}
connectDB();
console.log( process.argv)
