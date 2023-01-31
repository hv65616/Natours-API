const express = require('express');
const app = express();
const port = 3000;
const fs = require('fs');
// this is a middleware
app.use(express.json());
// Reading the tours-simple json file and including it in var tours
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// we made a custom fucntion for the get request and now instead of writing same code and on singele fucntion we can import this directly
const getalltours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
};
// get request for a end point that will return the data int json format
// app.get('/api/v1/tours', getalltours);

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
// /:id - this is a variable defineing technique where we can pass a value to a variable and obtain result accoding to that
app.get('/api/v1/tours/:id', getaparticulartour);

// post request for a end point that will used to send data to server and update it on the json file
app.post('/api/v1/tours', (req, res) => {
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
});

// Put request update when any new entry id made while patch update the properties only
// the following patch request will currently do not update any record as we have to properly include it but it will show how the things work out
app.patch('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({ status: 'faild', message: 'invalid id' });
  }
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<updated tour here' } });
});

// delete request is used to delete data matching particular id
app.delete('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({ status: 'faild', message: 'invalid id' });
  }
  res.status(204).json({ status: 'success', data: null });
});

// app.route is a way to chaining same type of request all together
// app.route('/api/v1/tours').get(getalltours);

app.listen(port, () => {
  console.log('Server is listening on port 3000');
});
