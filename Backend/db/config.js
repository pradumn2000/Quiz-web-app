// import mongoose from "mongoose"
// import"dotenv/config.js"

// const connectDB=async()=>{
//     try{
//         let conn= await mongoose.connect(process.env.MONGO_URL)
//         if (conn)
//             console.log("Datbase server connected....")
//     }
//     catch(error){
//         console.log(error)
//     }
// }
// export default connectDB;
import mongoose from 'mongoose';
import chalk from 'chalk';
import 'dotenv/config';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(chalk.cyan('Database server connected....'));
  } catch (error) {
    console.error(chalk.red(`MongoDB Connection Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;