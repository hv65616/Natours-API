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
// get request for a end point that will return the data int json format
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});
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
app.listen(port, () => {
  console.log('Server is listening on port 3000');
});
