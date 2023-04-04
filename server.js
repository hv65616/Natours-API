const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;
const db = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);
// console.log(app.get('env'));
// console.log(process.env);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => {
    // The below code shows all connections request and messages and not necessary to console log
    // console.log(con.connection);
    console.log('DB connection successful');
  });

app.listen(port, () => {
  console.log('Server is listening on port 3000');
});

// mongodb+srv://vermah564:<password>@cluster0.qpawwas.mongodb.net/Natours?retryWrites=true&w=majority

// npm run start:prod or start:dev
