const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const cors = require('cors')
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PackageController = require('./controllers/PackageController');
app.use(PackageController);
const MemberController = require('./controllers/MemberController');
app.use(MemberController);

app.listen(port, () => {
    console.log('Server listening on port', port)
})   
