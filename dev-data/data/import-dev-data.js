const fs = require('fs');
const tour = require('../../models/tourModels');
const dotenv = require('dotenv');
dotenv.config({ path: '../../config.env' });
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log('DB connection successful');
  });

// Read JSON File
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, 'utf-8')
);
// Import data into db
const importdata = async () => {
  try {
    const createdtour = await tour.create(tours);
    console.log('Data successfully loaded');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
// Delete all data from collection
const deletedata = async () => {
  try {
    const deleteddata = await tour.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};
if (process.argv[2] == '--import') {
  importdata();
} else if (process.argv[2] == '--delete') {
  deletedata();
}
console.log(process.argv);
