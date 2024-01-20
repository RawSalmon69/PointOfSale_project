const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

const cors = require('cors')
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/uploads', express.static('uploads')) //folder name

const PackageController = require('./controllers/PackageController');
app.use(PackageController);
const MemberController = require('./controllers/MemberController');
app.use(MemberController);
const ProductController = require('./controllers/ProductController');
app.use(ProductController);
const ProductImageController = require('./controllers/ProductImageController');
app.use(ProductImageController);
const UserController = require('./controllers/UserController');
app.use(UserController);
const BillSaleController = require('./controllers/BillSaleController');
app.use(BillSaleController);
const StockController = require('./controllers/StockController');
app.use(StockController);

app.listen(port, () => {
    console.log('Server listening on port', port)
})
