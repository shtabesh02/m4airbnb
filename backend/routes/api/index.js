// backend/routes/api/index.js
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage } = require('../../db/models');
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

// Get all Spots
router.get('/spots', async (req, res) => {
  const spots = await Spot.findAll();

  res.status(200);
  res.json({
    Spots: spots
  })
});

// Get all Spots owned by the Current User
router.get('/spots/current', async (req, res) => {
  const userId = await req.user.id;

  const spots = await Spot.findAll({
    where: {
      ownerId: userId
    }
  });

  res.status(200);
  res.json({
    Spots: spots
  })
});


// Get details of a Spot from an id
router.get('/spots/:spotId', async (req, res) => {
  const spotId = parseInt(req.params.spotId);
  const spotDetails = await Spot.findByPk(spotId, {
    include: [
      {
        model: SpotImage,
        attributes: ['id', 'url', 'preview']
      },
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }

    ],
  });

  res.json({
    Spots: spotDetails
  })
});

// Create a Spot
router.post('/spots',requireAuth , async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    
    const spot = await Spot.create({ address, city, state, country, lat, lng, name, description, price});

    return res.json({
      spot
    });
  }
);

module.exports = router;