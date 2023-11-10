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
// Add Query Filters to Get All Spots
router.get('/spots', async (req, res) => {

  // Query parameters
  let page = parseInt(req.query.page);
  let size = parseInt(req.query.size);
  const minLat = parseFloat(req.query.minLat);
  const maxLat = parseFloat(req.query.maxLat);
  const minLng = parseFloat(req.query.minLng);
  const maxLng = parseFloat(req.query.maxLng);
  const minPrice = parseFloat(req.query.minPrice);
  const maxPrice = parseFloat(req.query.maxPrice);

  const validationErrors = {};

  // let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

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
          [sequelize.fn('AVG', sequelize.col('Reviews.stars')), 'avgRating']],
        // sequelize.fn is with lower case
        include: [
          { model: Review, attributes: [] },
          { model: SpotImage, attributes: ['url', 'preview'] },
          { model: User, as: 'Owner', attributes: [] }
        ],
        // group: ['Spot.id', 'SpotImages.id'],       

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

    if (minLat !== undefined && (minLat < -90 || minLat > 90)) {
      paramsValidation.minLat = 'Minimum latitude is invalid';
    }
    if (maxLat !== undefined && (maxLat < -90 || maxLat > 90)) {
      paramsValidation.maxLat = 'Maximum latitude is invalid';
    }
    if (minLng !== undefined && (minLng < -180 || minLng > 180)) {
      paramsValidation.minLng = 'Minimum longitude is invalid';
    }
    if (maxLng !== undefined && (maxLng < -180 || maxLng > 180)) {
      paramsValidation.maxLng = 'Maximum longitude is invalid';
    }
    if (minPrice !== undefined && (minPrice < 0)) {
      paramsValidation.minPrice = 'Minimum price must be greater than or equal to 0';
    }
    if (maxPrice !== undefined && (maxPrice < 0)) {
      paramsValidation.maxPrice = 'Maximum price must be greater than or equal to 0';
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
        where: {
          price: { [Op.between]: [minPrice, maxPrice] },
          lat: { [Op.between]: [minLat, maxLat] },
          lng: { [Op.between]: [minLng, maxLng] }
        },
        include: [
          { model: Review, attributes: [] },
          { model: SpotImage, attributes: ['url', 'preview'] },
          { model: User, as: 'Owner', attributes: [] }
        ],
        // group: ['Spot.id', 'SpotImages.id']
        // group: ['Spot.id', 'Reviews.id', 'SpotImages.id', 'Owner.id'],

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
      });
    }

  } else {
    const spots = await Spot.findAll({
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
        'description', 'price', 'createdAt', 'updatedAt',
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']],

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
    // group: ['Spot.id', 'SpotImages.id']
  });

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

//
// Get details of a Spot from an id
router.get('/spots/:spotId', requireAuth, async (req, res) => {
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
      // group: ['Spot.id', 'SpotImages.id']
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
router.post('/spots', requireAuth, async (req, res) => {
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

  const _spotId = await Spot.findOne({
    where: {
      id: spotId
    }
  });
  if (_spotId) {
    const image = await SpotImage.create({ spotId, url, preview });
    const { id } = image;
    return res.status(200).json({
      id,
      url,
      preview
    })
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
    res.status(404);
    res.json({
      "message": "Spot couldn't be found"
    });
  }
});

// Delete a Spot
router.delete('/spots/:spotId', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const _spotId = await Spot.findByPk(spotId);
  if (_spotId) {
    await Spot.destroy({
      where: {
        id: spotId
      }
    });
    res.status(200).json({
      "message": "Successfully deleted"
    })
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
    // group: ['Review.id', 'ReviewImages.id', 'Users.id']
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
        { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] },
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

  const _reviewId = await Review.findOne({
    where: {
      id: reviewId
    }
  });

  if (_reviewId) {
    const maxImage = await ReviewImage.count({
      where: {
        reviewId: reviewId
      }
    });

    if (maxImage <= 10) {
      const image = await ReviewImage.create({ reviewId, url });

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
    return res.status(404).json({
      "message": "Review couldn't be found"
    });
  }

});

// Edit a Review
router.put('/reviews/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const { review, stars } = req.body;

  const spotId = await Review.findOne({
    attributes: ['spotId'],
    where: {
      id: reviewId
    }
  });

  const userId = await Review.findOne({
    attributes: ['userId'],
    where: {
      id: reviewId
    }
  });

  const created = await Review.findOne({
    attributes: ['createdAt'],
    where: {
      id: reviewId
    }
  });

  const _reviewId = await Review.findByPk(reviewId);
  if (_reviewId) {
    try {
      await Review.update({
        // spotId: spotId.spotId,
        // userId: userId.userId,
        review,
        stars,
        updatedAt: new Date()
      }, {
        where: {
          id: reviewId
        }
      });
      const updated = await Review.findOne({
        attributes: ['updatedAt'],
        where: {
          id: reviewId
        }
      });
      return res.status(200).json({
        id: reviewId,
        userId: userId.userId,
        spotId: spotId.spotId,
        review,
        stars,
        createdAt: created['createdAt'],
        updatedAt: updated['updatedAt']
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
    res.status(404).json({
      "message": "Review couldn't be found"
    });
  }

});

// Delete a Review
router.delete('/reviews/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;

  const _reviewId = await Review.findByPk(reviewId);
  if (_reviewId) {
    await Review.destroy({
      where: {
        id: reviewId
      }
    });

    res.status(200).json({
      "message": "Successfully deleted"
    });
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

  console.log('myResult: ', myResult)
  res.status(200).json({ Bookings: myResult });
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  const loggedInUser = req.user.id;

  const spotId = req.params.spotId;

  const _spotId = await Spot.findByPk(spotId);

  if (_spotId) {
    if (Number(loggedInUser) === Number(spotId)) {
      const booking = await Booking.findOne({
        attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'UpdatedAt'],
        where: {
          spotId
        },
        include: {
          model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'],
        }
      });
      res.status(200).json({
        Bookings: booking
      });
    } else {
      const booking = await Booking.findOne({
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
router.post('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const userId = req.user.id;
  const { startDate, endDate } = req.body;

  const _spotId = await Spot.findByPk(spotId);
  if (_spotId) {
    const existingBooking = await Booking.findOne({
      where: {
        spotId: spotId,
        [Sequelize.Op.or]: [
          {
            startDate: {
              [Sequelize.Op.lte]: new Date(endDate)
            },
            endDate: {
              [Sequelize.Op.gte]: new Date(startDate)
            }
          },
          {
            startDate: {
              [Sequelize.Op.gte]: new Date(startDate),
              [Sequelize.Op.lte]: new Date(endDate)
            }
          }
        ]
      }
    });
    if (existingBooking) {
      res.status(403).json({
        "message": "Sorry, this spot is already booked for the specified dates"
      });
    } else {
      // success
      try {
        const booking = await Booking.create({ spotId, userId, startDate, endDate });

        res.status(200).json({
          booking
        });
      } catch (error) {
        if (error.name = 'SequelizeValidationError') {
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
    }
  } else {
    res.status(404).json({
      "message": "Spot couldn't be found"
    });
  }

});

// Edit a Booking
// URL: /api/bookings/:bookingId
router.put('/bookings/:bookingId', requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const { startDate, endDate } = req.body;

  const _bookingId = await Booking.findByPk(bookingId);
  if (_bookingId) {
    const currentStartDate = await Booking.findOne({ where: { id: bookingId }, attributes: ['startDate'] });
    const currentEndDate = await Booking.findOne({ where: { id: bookingId }, attributes: ['endDate'] });

    const currentDate1 = new Date();
    const currentDate2 = currentDate1.toISOString().split('T')[0];

    if (startDate < currentDate2) {
      res.status(403).json({
        "message": "Past bookings can't be modified"
      });
    } else {
      try {
        const existingBooking = await Booking.findAll({
          where: {
            [Sequelize.Op.or]: [
              {
                startDate: {
                  [Sequelize.Op.between]: [startDate, endDate]
                }
              },
              {
                endDate: {
                  [Sequelize.Op.between]: [startDate, endDate]
                }
              }
            ]
          }
        });

        if (existingBooking.length === 0) {
          await Booking.update({ startDate, endDate }, {
            where: {
              id: bookingId
            }
          });

          const _newBooking = await Booking.findOne({
            where: {
              id: bookingId
            }
          });

          return res.status(200).json(_newBooking);
        } else {
          res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates"
          });
        }
      } catch (error) {
        if (error.name === 'SequelizeValidationError') {
          const ve = {};
          error.errors.forEach(e => {
            ve[e.path] = e.message
          });
          return res.status(400).json({
            message: "Bad Request",
            errors: ve
          });
        }
      }
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
  const _bookingId = await Booking.findByPk(bookingId);
  if (_bookingId) {
    const s = _bookingId['id'];
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
    res.status(404).json({
      "message": "Booking couldn't be found"
    });
  }
});

// IMAGES
// Delete a Spot Image
router.delete('/spot-images/:imageId', requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const _imageId = await SpotImage.findByPk(imageId);
  if (_imageId) {
    await SpotImage.destroy({
      where: {
        id: imageId
      }
    });
    res.status(200).json({
      "message": "Successfully deleted"
    });
  } else {
    res.status(404).json({
      "message": "Spot Image couldn't be found"
    });
  }
});

// Delete a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  const imageId = req.params.imageId;
  const _imageId = await ReviewImage.findByPk(imageId);
  if (_imageId) {
    await ReviewImage.destroy({
      where: {
        id: imageId
      }
    });
    res.status(200).json({
      "message": "Successfully deleted"
    });
  } else {
    res.status(404).json({
      "message": "Review Image couldn't be found"
    });
  }
});

module.exports = router;