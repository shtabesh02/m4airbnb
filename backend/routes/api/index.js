// backend/routes/api/index.js

const express = require('express');
const { Op, where } = require('sequelize');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { sequelize } = require('sequelize');


const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');

const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');

router.use(restoreUser);

router.use('/session', sessionRouter);

router.use('/users', usersRouter);

// Test the API router
router.post('/test', function (req, res) {
  res.json({ requestBody: req.body });
});

// Spot input validations
const validateSpotInput = [
  check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
  check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
  check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
  check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
  check('lat')
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude is not valid'),
  check('lat')
      .notEmpty()
      .withMessage('Latitude is required'),
  check('lng')
      .isFloat({ min: -180, max: 180})
      .withMessage('Longitude is not valid'),
  check('lng')
      .notEmpty()
      .withMessage('Longitude is required'),
  check('name')
      .isLength({ min: 1, max: 50 })
      .withMessage('Name must be less than 50 characters'),
  check('description')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Description is required'),
  check('price')
      .isFloat({ gt:0 })
      .withMessage('Price per day is required'),
  handleValidationErrors
];

// Edit booking validation for checking withing or surrounding
const validateEditWithingSurroudning = [
  check('conflict_message') // Does not conflict within or surrounding itself
    .custom(async (value, { req }) => {
      // const [value1, value2] = values;
      if (req.body.startDate && req.body.endDate) {
        const existingBooking = await Booking.findOne({
          where: {
            // id: req.params.bookingId,
            [Sequelize.Op.or]: [
              // check within
              {
                startDate: { [Sequelize.Op.lt]: new Date(req.body.startDate) },
                endDate: { [Sequelize.Op.gt]: new Date(req.body.endDate) }
              },
              // check surrounding
              {
                startDate: { [Sequelize.Op.gt]: new Date(req.body.startDate) },
                endDate: { [Sequelize.Op.lt]: new Date(req.body.endDate) }
              },
            ]
          },
        });
          if (existingBooking) {
            if (parseInt(existingBooking.id) !== parseInt(req.params.bookingId)) { // Itself
              throw new Error('Date conflicts with an existing booking');
            } else {
              return true;
            }
          }
      }
    }),
  handleValidationErrors
]

// Create booking validation for checking withing or surrounding
const validateCreationWithingSurroudning = [
  check('conflict_message') // Does not conflict within or surrounding itself
    .custom(async (value, { req }) => {
      // const [value1, value2] = values;
      if (req.body.startDate && req.body.endDate) {
        const existingBooking = await Booking.findOne({
          where: {
            // id: req.params.bookingId,
            [Sequelize.Op.or]: [
              // check within
              {
                startDate: { [Sequelize.Op.lt]: new Date(req.body.startDate) },
                endDate: { [Sequelize.Op.gt]: new Date(req.body.endDate) }
              },
              // check surrounding
              {
                startDate: { [Sequelize.Op.gt]: new Date(req.body.startDate) },
                endDate: { [Sequelize.Op.lt]: new Date(req.body.endDate) }
              },
            ]
          },
        });
          if (existingBooking) {
              throw new Error('Date conflicts with an existing booking');
            } else {
              return true;
            }
      }
    }),
  handleValidationErrors
]
// Booking and Editing validations
const validateBooking = [
  check('bookingId')
    .custom(async (value, { req }) => {
      const bookingId = req.params.bookingId;
      if (bookingId === undefined) {
        return
      } else {
        const existingBooking = await Booking.findByPk(bookingId)
        if (!existingBooking) {
          throw new Error("Booking couldn't be found")
        }else{
          return
        }
      }
    }),
  check('startDate')
    .custom(async (value , {req}) => {
      const today = new Date();
      const startDate = new Date(value);
      if (startDate < today) {
        throw new Error('startDate cannot be in the past');
      }
    }),
  check('startDate') // Start Date On Existing Start Date
    .custom(async (value, {req}) => {
      const existingStartDate = await Booking.findOne({
        where: {
          startDate: new Date(value)
        }
      });
      if(existingStartDate){
        throw new Error('Start Date on Existing Start Date')
      }
    }),
  check('startDate') // Start Date On Existing End Date
    .custom(async (value, {req}) => {
      const existingEndDate = await Booking.findOne({
        where: {
          endDate: new Date(value)
        }
      })
      if(existingEndDate){
        throw new Error('Start Date On Existing End Date')
      }
    }),
  check('startDate')  // Start Date During Existing Booking
    .custom(async (value, {req}) => {
      const existingBooking = await Booking.findOne({
        where: {
          startDate: {[Sequelize.Op.lt]: new Date(value)},
          endDate: {[Sequelize.Op.gt]: new Date(value)}
        }
      })
      if (existingBooking){
        if(parseInt(existingBooking.id) !== parseInt(req.params.bookingId)){ // Itself
          throw new Error('startDate conflicts with an existing booking');
        }else{
          return true;
        }
      } 
    }),
  check('startDate')
    .notEmpty()
    .withMessage('startDate is required'),
  check('endDate') //End Date On Existing Start Date
    .custom(async (value, {req}) => {
      const existingStartDate = await Booking.findOne({
        where: {
          startDate: new Date(value)
        }
      })
      if(existingStartDate){
        throw new Error('End Date On Existing Start Date')
      }
    }),
  check('endDate') // End Date On Existing End Date
    .custom(async (value, {req}) => {
      const existingEndDate = await Booking.findOne({
        where: {
          endDate: new Date(value)
        }
      })
      if(existingEndDate){
        throw new Error('End Date On Existing End Date')
      }
    }),
  check('endDate') // End Date During Existing Booking
    .custom(async (value, {req}) => {
      const existingBooking = await Booking.findOne({
        where: {
          startDate: {[Sequelize.Op.lt]: new Date(value)},
          endDate: {[Sequelize.Op.gt]: new Date(value)}
        }
      })
      if (existingBooking){
        if(parseInt(existingBooking.id) !== parseInt(req.params.bookingId)){ // Itself
          throw new Error('endDate conflicts with an existing booking');
        }else{
          return true;
        }
      } 
    }),
  check('endDate')
    .exists({ checkFalsy: true })
    .notEmpty()
    .custom(async (value, { req }) => {
      const selectedStartDate = new Date(req.body.startDate);
      const selectedEndDate = new Date(value);
      if (selectedEndDate <= selectedStartDate) {
        throw new Error('endDate cannot be on or before startDate');
      }

      const existingBooking = await Booking.findOne({
        where: {
          // id: req.params.bookingId,
          [Sequelize.Op.or]: [
            // endDate in a range
            {
              startDate: {[Sequelize.Op.lt]: new Date(value)},
              endDate: {[Sequelize.Op.gt]: new Date(value)}
            },
            // surrounding a current range
            {
              [Sequelize.Op.and]: [
                { startDate: {[Sequelize.Op.gt]: new Date(req.body.startDate)} },
                { endDate: {[Sequelize.Op.lt]: new Date(value)} }
              ],
            }
          ],
        }
      });
      if (existingBooking){
        if(existingBooking.id !== req.params.bookingId){
          return true;
        }else{
        throw new Error('End date conflicts with an existing booking')
      }
      } 
    }),
  check('endDate')
    .notEmpty()
    .withMessage('endDate is required'),
  handleValidationErrors
];

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

// -----------------------------------------
// Get all Spots including their images

router.get('/spots/spotsimages', async (req, res) => {
  const spotsimages = await Spot.findAll({
    attributes: ['id', 'ownerId'],
        include: [
          { model: SpotImage, attributes: ['url', 'preview'] },
          { model: User, as: 'Owner', attributes: [] }
        ],
        group: ['Spot.id', 'SpotImages.id'],
        subQuery: false,
  });

  res.status(200).json(spotsimages)

})
// -----------------------------------------

// Get all Spots
// Add Query Filters to Get All Spots
router.get('/spots', async (req, res) => {

  // Query parameters
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);
  const minLat = parseFloat(req.query.minLat) || undefined;
  const maxLat = parseFloat(req.query.maxLat) || undefined;
  const minLng = parseFloat(req.query.minLng) || undefined;
  const maxLng = parseFloat(req.query.maxLng) || undefined;
  const minPrice = parseFloat(req.query.minPrice) || undefined;
  const maxPrice = parseFloat(req.query.maxPrice) || undefined;

  const validationErrors = {};

  if (page || size) {
    page = Number(page);
    size = Number(size);

    // Page & Size validation
    const validatePage = (page) => {
      if (page < 1 || page > 10) {
        validationErrors.page = 'Page must be between 1 and 10';
      }
    };

    const validateSize = (size) => {
      if (size < 1 || size > 20) {
        validationErrors.size = 'Size must be between 1 and 20';
      }
    };

    validatePage(page);
    validateSize(size);

    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        message: 'Bad Request',
        validationErrors,
      });
    } else {
      const spots = await Spot.findAll({
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
          'description', 'price', 'createdAt', 'updatedAt',
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']],
        // sequelize.fn is with lower case
        include: [
          { model: Review, attributes: [] },
          { model: SpotImage, attributes: ['url', 'preview'] },
          { model: User, as: 'Owner', attributes: [] }
        ],
        group: ['Spot.id', 'SpotImages.id'],

        subQuery: false,

        offset: size * (page - 1), limit: size
      });

      const spots_result = [];
      spots.forEach(spot => {
        spots_result.push(spot.toJSON())
      });

      spots_result.forEach(spot => {
        spot.SpotImages.forEach(img => {
          if (img.preview === true) {
            spot.previewImage = img.url;
          }
        });
        if (!spot.previewImage) {
          spot.previewImage = 'No image to preview'
        }
        delete spot.SpotImages
      });

      res.status(200).json({
        Spots: spots_result,
        page,
        size
      });
    }
  } else if (maxLat || minLat || maxLng || minLng || minPrice || maxPrice) {
    // Validating query parameters
    const paramsValidation = {};
    const filters = {};

    if (minLat !== undefined && (minLat < -90 || minLat > 90)) {
      paramsValidation.minLat = 'Minimum latitude is invalid';
    } else if (minLat !== undefined) {
      filters.lat = { [Op.gte]: minLat } // first
      // filters.lat = { ...(filters.lat || {}), [Op.gte]: [minLat] }
    }

    if (maxLat !== undefined && (maxLat < -90 || maxLat > 90)) {
      paramsValidation.maxLat = 'Maximum latitude is invalid';
    } else if (maxLat !== undefined) {
      filters.lat = { ...(filters.lat || {}), [Op.lte]: [maxLat] }
    }

    if (minLng !== undefined && (minLng < -180 || minLng > 180)) {
      paramsValidation.minLng = 'Minimum longitude is invalid';
    } else if (minLng !== undefined) {
      filters.lng = { [Op.gte]: [minLng] }; // first
      // filters.lng = { ...(filters.lng || {}), [Op.gte]: [minLng] };
    }

    if (maxLng !== undefined && (maxLng < -180 || maxLng > 180)) {
      paramsValidation.maxLng = 'Maximum longitude is invalid';
    } else if (maxLng !== undefined) {
      filters.lng = { ...(filters.lng || {}), [Op.lte]: [maxLng] };
    }

    if (minPrice !== undefined && (minPrice < 0)) {
      paramsValidation.minPrice = 'Minimum price must be greater than or equal to 0';
      // filters.price = { [Op.or]: [{[Op.gte]: [minPrice]}, {[Op.lte]: [maxPrice]}] }
    } else if (minPrice !== undefined) {
      filters.price = { [Op.gte]: [minPrice] }; //first
      // filters.price = { ...(filters.price || {}), [Op.gte]: minPrice };
    }

    if (maxPrice !== undefined && (maxPrice < 0)) {
      paramsValidation.maxPrice = 'Maximum price must be greater than or equal to 0';
    } else if (maxPrice !== undefined) {
      filters.price = { ...(filters.price || {}), [Op.lte]: maxPrice };
    }

    // End of validations

    if (Object.keys(paramsValidation).length > 0) {
      return res.status(400).json({
        message: 'Bad Request',
        paramsValidation,
      });
    } else {
      const spots = await Spot.findAll({
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
          'description', 'price', 'createdAt', 'updatedAt',
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']],
        where: { ...filters },
        // where: {
        //   price: {[Op.gte]: [minPrice]},
        //   price: {[Op.lte]: [maxPrice]}
        // },
        include: [
          { model: Review, attributes: [] },
          { model: SpotImage, attributes: ['url', 'preview'] },
          { model: User, as: 'Owner', attributes: [] }
        ],
        group: ['Spot.id', 'SpotImages.id']
        // group: ['Spot.id', 'Reviews.id', 'SpotImages.id', 'Owner.id'],
      });

      // raw: true is equal to toJSON() and we can pass it as an argument to finder methods
      // like where inside the {}
      const spots_result = [];
      spots.forEach(spot => {
        spots_result.push(spot.toJSON())
      });

      spots_result.forEach(spot => {
        spot.SpotImages.forEach(img => {
          if (img.preview === true) {
            spot.previewImage = img.url;
          }
        });
        if (!spot.previewImage) {
          spot.previewImage = 'No image to preview'
        }
        delete spot.SpotImages
      });

      res.status(200).json({
        Spots: spots_result,
      });
    }

  } else {
    const spots = await Spot.findAll({
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
        'description', 'price', 'createdAt', 'updatedAt',
        // [Sequelize.literal('ROUND(AVG(Reviews.stars), 2)'), 'avgRating']],
     
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']], // works fine but need to set the decimal

      include: [
        { model: Review, attributes: [] },
        { model: SpotImage, attributes: ['id', 'url', 'preview'] },
        { model: User, as: 'Owner', attributes: [] }
      ],
      group: ['Spot.id', 'SpotImages.id']

    });

    const spots_result = [];
    spots.forEach(spot => {
      spots_result.push(spot.toJSON())
    });

    spots_result.forEach(spot => {
      spot.SpotImages.forEach(img => {
        if (img.preview === true) {
          spot.previewImage = img.url;
        }
      });
      if (!spot.previewImage) {
        spot.previewImage = 'No image to preview'
      }
      delete spot.SpotImages
    });
    res.status(200).json({
      Spots: spots_result
    });
  }
});

// Get all Spots owned by the Current User
router.get('/spots/current', requireAuth, async (req, res) => {
  const userId = await req.user.id;

  const spots = await Spot.findAll({
    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
      'description', 'price', 'createdAt', 'updatedAt',
      [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']],

    where: {
      ownerId: userId
    },

    include: [
      { model: Review, attributes: [] },
      { model: SpotImage, attributes: ['url', 'preview'] },
      { model: User, as: 'Owner', attributes: [] }
    ],
    group: ['Spot.id', 'SpotImages.id']
  });
// [Sequelize.fn('DECIMAL', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 2), 'avgRating']


  // customized output

  const currentUserSpots = [];
  spots.forEach(spot => {
    currentUserSpots.push(spot.toJSON())
  });

  currentUserSpots.forEach(spot => {
    spot.SpotImages.forEach(img => {
      if (img.preview === true) {
        spot.previewImage = img.url;
      }
    });
    if (!spot.previewImage) {
      spot.previewImage = 'No image to preview'
    }
    delete spot.SpotImages
  });

  res.status(200).json({
    Spots: currentUserSpots
  });
});

// Get details of a Spot from an id
router.get('/spots/:spotId', async (req, res) => {
  const spotId = parseInt(req.params.spotId);

  const _spotId = await Spot.findOne({ where: { id: spotId } });

  if (_spotId) {
    const spotDetails = await Spot.findByPk(spotId, {
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
        'description', 'price', 'createdAt', 'updatedAt',
        [Sequelize.fn('COUNT', Sequelize.col('Reviews.stars')), 'numReviews'],
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']],

      include: [
        { model: Review, attributes: [] },
        { model: SpotImage, attributes: ['id', 'url', 'preview'] },
        { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] }
      ],
      group: ['Spot.id', 'SpotImages.id', 'Owner.id']
    });

    res.status(200).json(spotDetails)
  } else {
    res.status(404).json(
      {
        "message": "Spot couldn't be found"
      });
  }
});

// Create a Spot
router.post('/spots', requireAuth, validateSpotInput, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const ownerId = req.user.id;
  try {
    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price });
    res.status(201).json(spot);
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const ve = {};
      error.errors.forEach(errorItem => {
        ve[errorItem.path] = errorItem.message;
      });
      res.status(400).json({
        message: 'Bad Request',
        errors: ve
      });
    }
  }
}
);

// Add an Image to a Spot based on the Spot's id
router.post('/spots/:spotId/images', requireAuth, async (req, res) => {

  const spotId = req.params.spotId;
  const { url, preview } = req.body;

  const spot = await Spot.findByPk(spotId);

  if (spot) {
    // authorization
    const currentUser = req.user.id;

    if (currentUser === spot.ownerId) {
      // insertion using association method
      const image = await spot.createSpotImage({ url, preview });

      // insertion not using association facilities
      // const image = await SpotImage.create({ spotId, url, preview });

      // showing the result
      const { id } = image;
      return res.status(200).json({
        id,
        url,
        preview
      })
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }
  } else {
    res.status(404).json({
      "message": "Spot couldn't be found"
    })
  }
});

// Edit a Spot
router.put('/spots/:spotId', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  const spot = await Spot.findByPk(spotId);
  if (spot) {
    // authorization
    const currentUser = req.user.id;

    if (currentUser === spot.ownerId) {
      try {
        await Spot.update(
          { address, city, state, country, lat, lng, name, description, price },
          {
            where: {
              id: spotId
            }
          });

        const updatedSpot = await Spot.findByPk(spotId);
        return res.status(200).json(updatedSpot);
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const ve = {};
          error.errors.forEach(e => {
            ve[e.path] = e.message;
          });
          return res.status(400).json({
            message: "Bad Request",
            errors: ve
          });
        }
      }
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }

  } else {
    res.status(404);
    res.json({
      "message": "Spot couldn't be found"
    });
  }
});

// Delete a Spot
router.delete('/spots/:spotId', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId);

  // authorization
  const currentUser = req.user.id;

  if (spot) {
    if (currentUser === spot.ownerId) {
      await Spot.destroy({
        where: {
          id: spotId
        }
      });
      res.status(200).json({
        "message": "Successfully deleted"
      })
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }

  } else {
    res.status(404).json({
      "message": "Spot couldn't be found"
    });
  }
});

// REVIEWS
// Get all Reviews of the Current User
router.get('/reviews/current', requireAuth, async (req, res) => {
  const current = req.user.id;
  const reviews = await Review.findAll({
    attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
    where: {
      userId: current
    },
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      {
        model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: { model: SpotImage }
      },
      { model: ReviewImage, attributes: ['id', 'url'] }
    ],
    group: ['Review.id', 'ReviewImages.id', 'User.id', 'Spot.id', 'Spot.SpotImages.id']
  });

  // customized output
  const reviews_output = [];
  reviews.forEach(review => {
    reviews_output.push(review.toJSON());
  });

  reviews_output.forEach(review => {
    review.Spot.SpotImages.forEach(img => {
      if (img.preview === true) {
        review.Spot.previewImage = img.url;
      }
    });
    if (!review.Spot.previewImage) {
      review.Spot.previewImage = 'No imaage to preview'
    }
    delete review.Spot.SpotImages;
  });

  res.status(200).json({
    Reviews: reviews_output
  })
});

// Get all Reviews by a Spot's id
router.get('/spots/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId;
  const _spotId = await Spot.findByPk(spotId);

  if (_spotId) {
    const reviews = await Review.findAll({
      where: {
        spotId
      },
      include: [
        { model: User, attributes: ['id', 'firstName', 'lastName'] },
        { model: ReviewImage, attributes: ['id', 'url'] }
      ]
    });

    res.status(200).json({
      Reviews: reviews
    })
  } else {
    res.status(404).json({
      "message": "Spot couldn't be found"
    });
  }
});


// Create a Review for a Spot based on the Spot's id
router.post('/spots/:spotId/reviews', requireAuth, async (req, res) => {

  const currentUser = req.user.id;
  const spotId = req.params.spotId;
  const existingReview = await Review.findOne({ where: { userId: currentUser, spotId: spotId } });

  if (!existingReview) {

    const userId = req.user.id;
    const { review, stars } = req.body;

    const existingSpot = await Spot.findByPk(spotId);

    if (existingSpot) {
      try {
        const _review = await Review.create({ spotId, userId, review, stars });
        const { id } = _review;

        const currentReview = await Review.findAll({
          where: {
            id
          }
        });

        return res.status(201).json(currentReview[0]);

      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const ve = {};
          error.errors.forEach(err => {
            ve[err.path] = err.message;
          });

          res.status(400).json({
            message: "Bad Request",
            errors: ve
          });
        }
      }
    } else {
      res.status(404).json({
        "message": "Spot couldn't be found"
      });
    }
  } else {
    res.status(500).json({
      "message": "User already has a review for this spot"
    });
  }
});

// Add an Image to a Review based on the Review's id
router.post('/reviews/:reviewId/images', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { url } = req.body;

  const review = await Review.findByPk(reviewId);

  // authorization
  const currentUser = req.user.id;

  if (review) {
    if (currentUser === review.userId) {
      const imgCount = await ReviewImage.count();

      if (imgCount < 10) {
        const image = await review.createReviewImage({ reviewId, url });

        const img = {
          id: image.id,
          url: image.url
        }
        return res.status(200).json(img);
      } else {
        return res.status(403).json({
          "message": "Maximum number of images for this resource was reached."
        });
      }
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }


  } else {
    return res.status(404).json({
      "message": "Review couldn't be found"
    });
  }

});


// Edit a Review
router.put('/reviews/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { review, stars } = req.body;

  const oldReview = await Review.findByPk(reviewId);

  // authorization
  const currentUser = req.user.id;

  if (oldReview) {
    if (currentUser === oldReview.userId) {
      try {
        await Review.update({
          review,
          stars,
          updatedAt: new Date()
        }, {
          where: {
            id: reviewId
          }
        });
        const updatedReview = await Review.findByPk(reviewId);
        return res.status(200).json({
          id: reviewId,
          userId: updatedReview.userId,
          spotId: updatedReview.spotId,
          review,
          stars,
          createdAt: updatedReview.createdAt,
          updatedAt: updatedReview.updatedAt
        });
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const ve = {};
          error.errors.forEach(err => {
            ve[err.path] = err.message;
          });
          res.status(400).json({
            message: 'Bad Request',
            error: ve
          });
        }
      }
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }

  } else {
    res.status(404).json({
      "message": "Review couldn't be found"
    });
  }
});

// Delete a Review
router.delete('/reviews/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;

  const currentUser = req.user.id;

  const review = await Review.findByPk(reviewId);
  if (review) {
    if (currentUser === review.userId) {
      await Review.destroy({
        where: {
          id: reviewId
        }
      });
      res.status(200).json({
        "message": "Successfully deleted"
      });
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }
  } else {
    res.status(404).json({
      "message": "Review couldn't be found"
    });
  }

});

// BOOKINGS
// Get all of the Current User's Bookings
router.get('/bookings/current', requireAuth, async (req, res) => {
  const currentUser = req.user.id;

  const bookings = await Booking.findAll({
    where: {
      userId: currentUser
    },
    include: [
      {
        model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: { model: SpotImage, attributes: ['url', 'preview'] }
      },

    ]
  });

  // using toJSON()
  const myResult = [];
  bookings.forEach(booking => {
    myResult.push(booking.toJSON());
  });

  myResult.forEach(booking => {
    booking.Spot.SpotImages.forEach(img => {
      if (img.preview === true) {
        booking.Spot.previewImage = img.url
      }
    });
    if (!booking.Spot.previewImage) {
      booking.Spot.previewImage = 'No preview image found!'
    }
    delete booking.Spot.SpotImages
  });

  res.status(200).json({ Bookings: myResult });
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  const loggedInUser = req.user.id;

  const spotId = req.params.spotId;

  const spot = await Spot.findByPk(spotId);
  
  if (spot) {
    // If you ARE the owner of the spot
    if (parseInt(loggedInUser) === parseInt(spot.ownerId)) {
      const booking = await Booking.findAll({
        attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
        where: {
          spotId
        },
        include: {
          model: User, attributes: ['id', 'firstName', 'lastName'],
        }
      });
      res.status(200).json({
        Bookings: booking
      });
    } else {
      // If you ARE NOT the owner of the spot.
      const booking = await Booking.findAll({
        attributes: ['spotId', 'startDate', 'endDate'],
        where: {
          spotId
        }
      });
      res.status(200).json({
        Bookings: booking
      });
    }
  } else {
    res.status(404).json({
      "message": "Spot couldn't be found"
    });
  }
});

// Create a Booking from a Spot based on the Spot's id
router.post('/spots/:spotId/bookings', requireAuth, validateCreationWithingSurroudning, validateBooking, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  const spot = await Spot.findByPk(spotId);
  if (spot) {
    // Spot must NOT belong to the current user
    if (userId !== spot.ownerId) {

      // success
      try {
        // const booking = await Booking.create({ spotId, userId, startDate, endDate });
        const booking = await spot.createBooking({ userId, startDate, endDate });
        res.status(200).json(booking);
      } catch (error) {
        if (error.name = 'SequelizeValidationError') {
          const ve = {};
          error.errors.forEach(err => {
            ve[err.path] = err.message;
          });
          if (ve['endDate'] === 'endDate cannot be on or before startDate') { // this msg is set in booking model, validation
            return res.status(400).json({
              message: "Bad Request",
              errors: ve
            });
          } else {
            return res.status(403).json({
              message: "Sorry, this spot is already booked for the specified dates",
              errors: ve
            });
          }

        }
      }
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }

  } else {
    res.status(404).json({
      "message": "Spot couldn't be found"
    });
  }

});

// Edit a Booking
// URL: /api/bookings/:bookingId
router.put('/bookings/:bookingId', requireAuth, validateEditWithingSurroudning, validateBooking, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { startDate, endDate } = req.body;

  // authorization
  const currentUser = req.user.id;
  const booking = await Booking.findByPk(bookingId);

  if (booking) {
    if (currentUser === booking.userId) {
      const currentStartDate = await Booking.findOne({ where: { id: bookingId }, attributes: ['startDate'] });
      const currentEndDate = await Booking.findOne({ where: { id: bookingId }, attributes: ['endDate'] });

      const currentDate = new Date().toISOString().split('T')[0];

      if (startDate < currentDate) {
        return res.status(403).json({
          "message": "Past bookings can't be modified"
        });
      } else {
        try {
          await Booking.update({ startDate, endDate }, {
            where: {
              id: bookingId
            }
          });

          const updatedBooking = await Booking.findByPk(bookingId);

          return res.status(200).json(updatedBooking);
          // }
        } catch (error) {
          if (error.name = 'SequelizeValidationError') {
            const ve = {};
            error.errors.forEach(err => {
              ve[err.path] = err.message;
            });
            if (ve['endDate'] === 'endDate cannot be on or before startDate') { // this msg is set in booking model, validation
              return res.status(400).json({
                message: "Bad Request",
                errors: ve
              });
            } else {
              return res.status(403).json({
                message: "Sorry, this spot is already booked for the specified dates",
                errors: ve
              });
            }

          }
        }
      }
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }


  } else {
    return res.status(404).json({
      "message": "Booking couldn't be found"
    });
  }
});

// Delete a Booking
router.delete('/bookings/:bookingId', requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const currentUser = req.user.id;

  const booking = await Booking.findByPk(bookingId);


  const spot = await Spot.findAll({
    where: {
      ownerId: currentUser
    }
  });

  // authorization
  if (booking) {
    if (currentUser === booking.userId || spot.length > 0) {
      const s = booking['id'];
      const _startDate = await Booking.findOne({ where: { id: s }, attributes: ['startDate'] });
      const _startDate_ = _startDate['startDate'];
      const currentDate = new Date();
      if (_startDate_ <= currentDate) {
        res.status(403).json({
          "message": "Bookings that have been started can't be deleted"
        });
      } else {
        await Booking.destroy({
          where: {
            id: bookingId
          }
        });
        res.status(200).json({
          "message": "Successfully deleted"
        });
      }
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }
  } else {
    res.status(404).json({
      "message": "Booking couldn't be found"
    });

  }

});

// IMAGES
// Delete a Spot Image
router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const currentUser = req.user.id;
  const spotImage = await SpotImage.findByPk(imageId);

  // Authorization
  if (spotImage) {
    const spotId = spotImage.spotId;
    const spot = await Spot.findByPk(spotId);
    if (currentUser === spot.ownerId) {
      await SpotImage.destroy({
        where: {
          id: imageId
        }
      });
      res.status(200).json({
        "message": "Successfully deleted"
      });
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }
  } else {
    res.status(404).json({
      "message": "Spot Image couldn't be found"
    });
  }
});

// Delete a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const currentUser = req.user.id;
  const reviewImg = await ReviewImage.findByPk(imageId);

  if (reviewImg) {
    const reviewId = reviewImg.reviewId;
    const review = await Review.findByPk(reviewId);
    if (currentUser === review.userId) {
      await ReviewImage.destroy({
        where: {
          id: imageId
        }
      });
      res.status(200).json({
        "message": "Successfully deleted"
      });
    } else {
      return res.status(403).json(
        {
          "message": "Forbidden"
        }
      );
    }
  } else {
    res.status(404).json({
      "message": "Review Image couldn't be found"
    });
  }
});

module.exports = router;