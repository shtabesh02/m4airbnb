// backend/routes/index.js
const express = require('express');
const router = express.Router();

// importing routes from api/index
const apiRouter = require('./api');
router.use('/api', apiRouter);


router.get('/', async (req, res) => {
  res.json({
    "message": "Wlecome to this page. Currently it's under maintenance...!"
  });
})
// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

// The above route worked successfully.


// backend/routes/index.js
// ...
// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });
  // ...

module.exports = router;