const mongoose = require("mongoose");

const DB = process.env.DATABASE;

mongoose.set("strictQuery", false);

mongoose.connect(DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } 
).then(() => {
    console.log('DB connection is successful !!');
}) .catch( (err) => {
  console.error(`Error connecting to the database. \n${err}`);
})


