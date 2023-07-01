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
    // ******FILTERING*********
    // {...req.query} this create a copy of object so that original object remain unaffected to the changes
    // Here we are performing filtering i.e all the field name present in excludedfield if they are not found as value of query then only those field name will be considered whose value is present and then if we pass these valid to as query output will be shown
    const queryobject = { ...req.query };
    const excludedfield = ['page', 'sort', 'limit', 'fields'];
    excludedfield.forEach((el) => delete queryobject[el]);
    // console.log(req.query, queryobject);

    // **********ADVANCED FILTERING************
    let querystring = JSON.stringify(queryobject);
    querystring = querystring.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(querystring));

    // ********PASSING OR MAKING QUERY*************
    // There are two ways for passing query into database and retreiving data based on query
    // Method-1
    // const alltours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // });
    // Method-2
    // const alltours = await Tour.find(req.query);
    // Now from both these methods method 2 is much more convivenet as there is no static query being passed which will help user to search according to query that being pass on time

    // **********EXECUTINH QUERY WITH FILTER DATA
    // const alltours = await Tour.find(queryobject);

    // ***********EXECUTING QUERY WITH ADVANCE FILTERING
    const alltours = await Tour.find(JSON.parse(querystring));

    // ********SENDING RESPONSE*********
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

const deletetour = async (req, res) => {
  try {
    const tourdelete = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: tourdelete,
      message: 'Particular tour has been successfully deleted',
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

module.exports = {
  getalltours,
  createnewtour,
  updatetour,
  deletetour,
  getaparticulartour,
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
