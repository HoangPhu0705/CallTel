const loginRouter = require('./login');
const adminRouter = require('./admin');
const staffRouter = require('./staff');
const productRouter = require('./product');
const customerRouter = require('./customer');
const invoiceRouter = require('./invoice');
const authMiddleware = require('../app/middleware/auth');

function route(app) {
  app.use('/',loginRouter);
  app.use('/staff', authMiddleware.staff, staffRouter);
  app.use('/admin', authMiddleware.admin, adminRouter);
  app.use('/api/v1/product', productRouter);
  app.use('/api/v1/customer', customerRouter);
  app.use('/api/v1/invoices', invoiceRouter);
  app.use(authMiddleware.notFound);

  // ...
}

module.exports = route;