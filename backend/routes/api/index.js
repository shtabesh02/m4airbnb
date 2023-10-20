// backend/routes/api/index.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
// const { requireAuth } = require('../../utils/auth.js');
// const { setTokenCookie } = require('../../utils/auth.js');
// const { restoreUser } = require("../../utils/auth.js");




const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');


router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

// Test the API router
router.post('/test', function(req, res) {
    res.json({ requestBody: req.body });
  });
  



// GET /api/set-token-cookie
// const { User } = require('../../db/models');
router.get('/set-token-cookie', async (_req, res) => {
  const user = await User.findOne({
    where: {
      username: 'Demo-lition'
    }
  });
  setTokenCookie(res, user);
  return res.json({ user: user });
});



// GET /api/restore-user


router.get(
  '/restore-user',
  (req, res) => {
    return res.json(req.user);
  }
);




// GET /api/require-auth

router.get(
  '/require-auth',
  requireAuth,
  (req, res) => {
    return res.json(req.user);
  }
);



module.exports = router;