const fs = require('fs');
// Reading the tours-simple json file and including it in var tours
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );
const Tour = require('../models/tourModels');

// checkid as a param middleware
// const checkid = (req, res, next, val) => {
//   console.log(`Tour id is : ${val}`);
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({ status: 'faild', message: 'invalid id' });
//   }
//   next();
// };

// No longer needed
// const checkbody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'failed', message: 'missing name and price' });
//   }
//   next();
// };

// we made a custom fucntion for the get request and now instead of writing same code and on singele fucntion we can import this directly
// and also we have included the custom middleware 2 which will return the time
const getalltours = async (req, res) => {
  try {
    const alltours = await Tour.find();
    res.status(200).json({
      status: 'success',
      data: {
        alltours,
      },
    });
  } catch (error) {
    // console.log(error);
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// This is discarded in further developement process as it uses the local json file for fetching and updating the data
/*
const createnewtour = (req, res) => {
  // finding the newid number using the tourlength +1
  const newid = tours[tours.length - 1].id + 1;
  // here it will store the newtour passed through postman in json format when the post request made and assign the id and details to the var newtour and then push the new tour into the tours where all the previous tours are stored
  const newtour = Object.assign({ id: newid }, req.body);
  tours.push(newtour);
  // this section is reponsible for updating the tours-simple json file with the new tour entry then will be made by post request
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          // this will the new entry made as the post request hit
          tour: newtour,
          // this will show the all the entries
          // tours,
        },
      });
    }
  );
};
 */

const createnewtour = async (req, res) => {
  try {
    const newtour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newtour,
      },
    });
  } catch (error) {
    // console.log(error);
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// similary we have done for the post request
const getaparticulartour = async (req, res) => {
  // req.params - it will access the value that the user is passing as a argument
  try {
    const singletour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        tour: singletour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
  // const tour = tours.find((el) => el.id == id);
  // if (id > tours.length) {
  //   return res.status(404).json({ status: 'faild', message: 'invalid id' });
  // }
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

const updatetour = async (req, res) => {
  try {
    const tourupdate = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: tourupdate });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

const deletetour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};

module.exports = {
  getalltours,
  createnewtour,
  updatetour,
  deletetour,
  getaparticulartour,
};
