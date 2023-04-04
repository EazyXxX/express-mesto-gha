const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const index = require('./routes/index');

mongoose.set('strictQuery', false);
const app = express();
const PORT = 3000;
mongoose.set('runValidators', true);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}, (err) => {
  if (err) { console.log(err); } else console.log('MongoDB is connected');
});

app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(index);

app.listen(PORT, (error) => (error ? console.error(error) : console.log(`App listening on port ${PORT}`)));
