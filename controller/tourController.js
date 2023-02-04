const fs = require('fs');
// Reading the tours-simple json file and including it in var tours
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// checkid as a param middleware
const checkid = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({ status: 'faild', message: 'invalid id' });
  }
  next();
};

// we made a custom fucntion for the get request and now instead of writing same code and on singele fucntion we can import this directly
// and also we have included the custom middleware 2 which will return the time
const getalltours = (req, res) => {
  console.log(req.requesttime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    requestedat: req.requesttime,
    data: {
      tours,
    },
  });
};

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

// similary we have done for the post request
const getaparticulartour = (req, res) => {
  // req.params - it will access the value that the user is passing as a argument
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id == id);
  if (id > tours.length) {
    return res.status(404).json({ status: 'faild', message: 'invalid id' });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const updatetour = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<updated tour here' } });
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
  checkid,
};
