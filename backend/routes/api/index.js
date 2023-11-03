// backend/routes/api/index.js
const express = require('express');
const { Op, where } = require('sequelize');
const bcrypt = require('bcryptjs');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, ReviewImage, Booking, Sequelize } = require('../../db/models');
// const { requireAuth } = require('../../utils/auth.js');
// const { setTokenCookie } = require('../../utils/auth.js');
// const { restoreUser } = require("../../utils/auth.js");




const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { model } = require('mongoose');


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
// Add Query Filters to Get All Spots
// URL: /api/spots
// {{url}}/spots?page=1&size=3
// router.get('/spots', async (req, res) => {
//   const spots = await Spot.findAll();

//   res.status(200);
//   res.json({
//     Spots: spots
//   })
// });


router.get('/spots', async (req, res) => {
  let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

  if((page === undefined) && (size === undefined)){
    // no query
    const spots = await Spot.findAll({
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
      'description', 'price', 'createdAt','updatedAt',
      [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']],

      include: [
        { model: Review, attributes: []},
        {model: SpotImage, attributes: ['url', 'preview'],
        // where: {preview: true}
      }
      ],
      group: ['Spot.id',
      // 'SpotImages.url'
    ], raw: true
    });
            // Here is my customized result
            let previewImage = null;
            const formattedSpots = spots.map((spot) => {
              if(spot['SpotImages.preview'] !== 0){
                previewImage = spot['SpotImages.url'];
              }
              // Creating a new object with the desired format like the project
              return {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat: spot.lat,
                lng: spot.lng,
                name: spot.name,
                description: spot.description,
                price: spot.price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                avgRating: spot.avgRating,
                previewImage: previewImage,
              };
            });
    res.status(200).json({
      // spots,
      Spots: formattedSpots
    });
  }else{
  page = Number(page);
  size = Number(size);

  if(page < 1 || page > 10){
    throw new Error('Page must be greater than or equal to 1');
  }
  if(size < 1 || size > 20){
    throw new Error('Size must be greater than or equal to 1');
  }
  if(maxLat < -90 || maxLat > 90){
    throw new Error('Maximum latitude must be less than or equal to 90');
  }
  if(minLat < -90 || minLat > 90){
    throw new Error('Minimum latitude must be greater than or equal to -90');
  }
  if(maxLng < -180 || maxLng > 180){
    throw new Error('Minimum longitude must be greater than or equal to -180');
  }
  if(minLng < -180 && minLng > 180){
    throw new Error('Maximum longitude must be less than or equal to 180');
  }
  if(minPrice < 0 || minPrice > 100){
    throw new Error('Minimum price must be greater than or equal to 0');
  }
  if(maxPrice < 0 && maxPrice > 100){
    throw new Error('Maximum price must be less than or equal to 100');
  }

    const spots = await Spot.findAll({offset: size * (page - 1), limit: size});

    res.status(200).json({
      spots,
      page,
      size
  });
  }
});


// Get all Spots owned by the Current User
router.get('/spots/current', requireAuth, async (req, res) => {
  const userId = await req.user.id;

  // const spots = await Spot.findAll({
  //   where: {
  //     ownerId: userId
  //   }
  // });

  // res.status(200);
  // res.json({
  //   Spots: spots
  // })

  //...
  const spots = await Spot.findAll({
    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
    'description', 'price', 'createdAt','updatedAt',
    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']],

    include: [
      { model: Review, attributes: []},
      {model: SpotImage, attributes: ['url', 'preview'],
      // where: {preview: true}
    }
    ],
    group: ['Spot.id',
    // 'SpotImages.url'
  ], raw: true
  });
          // Here is my customized result
          let previewImage = null;
          const formattedSpots = spots.map((spot) => {
            if(spot['SpotImages.preview'] !== 0){
              previewImage = spot['SpotImages.url'];
            }
            // Creating a new object with the desired format like the project
            return {
              id: spot.id,
              ownerId: spot.ownerId,
              address: spot.address,
              city: spot.city,
              state: spot.state,
              country: spot.country,
              lat: spot.lat,
              lng: spot.lng,
              name: spot.name,
              description: spot.description,
              price: spot.price,
              createdAt: spot.createdAt,
              updatedAt: spot.updatedAt,
              avgRating: spot.avgRating,
              previewImage: previewImage,
            };
          });
  res.status(200);
  res.json({
    // spots,
    Spots: formattedSpots
  });
});


// Get details of a Spot from an id
router.get('/spots/:spotId', requireAuth, async (req, res) => {
  const spotId = parseInt(req.params.spotId);

  const _spotId = await Spot.findOne({where: {id:spotId}});

  if(_spotId){
    const spotDetails = await Spot.findByPk(spotId, {
      attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
    'description', 'price', 'createdAt','updatedAt',
    [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating']],
      include: [
        {model: Review, attributes: []},
        {model: SpotImage, attributes: ['id', 'url', 'preview']},
        {model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName']}
      ],
      group: ['Spot.id', 'SpotImages.id']
    });

    res.json({
      Spots: spotDetails
    })
  }else{
        res.json(
          {
            "message": "Spot couldn't be found"
          });
  }
});

// Create a Spot
router.post('/spots', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    
    const ownerId = req.user.id;

    const spot = await Spot.create({ ownerId, address, city, state, country, lat, lng, name, description, price});

    return res.status(201).json({
      spot
    });
  }
);

// Add an Image to a Spot based on the Spot's id
router.post('/spots/:spotId/images', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const {url, preview} = req.body;

  const _spotId = await Spot.findOne({
    where: {
      id: spotId
    }
  });
  if(_spotId){
    const image = await SpotImage.create({spotId, url, preview});
    const {id} = image;
  return res.status(200).json({
    id,
    url,
    preview
  })
  }else{
    res.json({
      "message": "Spot couldn't be found"
    })
  } 
});

// Edit a Spot
router.put('/spots/:spotId', requireAuth, async (req,res) => {
    const spotId = req.params.spotId;
    const {address, city, state, country, lat, lng, name, description, price} = req.body;

    const spot = await Spot.findByPk(spotId);
    if(spot){
      await Spot.update(
        {address, city, state, country, lat, lng, name, description,price},
          {
            where: {
            id: spotId
          } 
      });

      const updatedSpot = await Spot.findByPk(spotId);
      return res.status(200).json({
        updatedSpot
      })
    }else{
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
  if(_spotId){
    await Spot.destroy({
    where: {
      id: spotId
    }
  });
  res.status(200).json({
    "message": "Successfully deleted"
  })
  }else{
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
      { model: Spot },
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      { model: ReviewImage, attributes: ['id', 'url'] }
    ],
    group: ['Review.id', 'ReviewImages.id']
  });

  // Customized output
  const formattedReviews = reviews.map( review => {
    return {
      id: review.id,
      userId: review.userId,
      spotId: review.spotId,
      review: review.review,
      stars: review.stars,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      User: {
        id: review.User.id,
        firstName: review.User.firstName,
        lastName: review.User.lastName
      },
      Spot: {
        id: review.Spot.id,
        ownerId: review.Spot.reviewId,
        address: review.Spot.address,
        city: review.Spot.city,
        state: review.Spot.state,
        country: review.Spot.country,
        lat: review.Spot.lat,
        lng: review.Spot.lng,
        name: review.Spot.name,
        price: review.Spot.price,
        previewImage: review.ReviewImages[0] ? review.ReviewImages[0].url : null
      },
      ReviewImage: review.ReviewImages.map(img => {
        return {
          id: img.id,
          url: img.url
        }
      })
    }
  });

  res.status(200).json({
    formattedReviews
  })
});

// Get all Reviews by a Spot's id
router.get('/spots/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId;
  const _spotId = await Spot.findByPk(spotId);

  if(_spotId){
    const reviews = await Review.findAll({
    where: {
      spotId
    },
    include: [
      { model: User, attributes: ['id', 'firstName', 'lastName'] },
      { model: ReviewImage, attributes: ['id', 'url']}
    ]
  });

  res.status(200).json({
    reviews
  })
  }else{
    res.status(404).json({
      "message": "Spot couldn't be found"
    });
  }
});


// Create a Review for a Spot based on the Spot's id
router.post('/spots/:spotId/reviews', requireAuth, async (req, res) => {

  const currentUser = req.user.id;
  const spotId = req.params.spotId;
  const existingReview = await Review.findOne({where: {userId: currentUser, spotId: spotId}});

  if(!existingReview){
      
      const userId = req.user.id;
      const {review, stars} = req.body;

      const existingSpot = await Spot.findByPk(spotId);

      let currentReview;

      if(existingSpot){
        const _review = await Review.create({spotId, userId, review, stars});
        const {id} = _review;

      currentReview = await Review.findAll({
        where: {
          id
        }
      });

      res.status(201).json({
        currentReview
      })
      }else{
        res.status(404).json({
          "message": "Spot couldn't be found"
        });
      }
  }else{
    res.status(500).json({
      "message": "User already has a review for this spot"
    });
  }

  
  
});

// Add an Image to a Review based on the Review's id
router.post('/reviews/:reviewId/images', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const {url} = req.body;

  const _reviewId = await Review.findByPk(reviewId);

  if(_reviewId){

    const maxImage = await ReviewImage.count();

    console.log('max num: ', maxImage);
    if(maxImage <= 10){
      const image = await ReviewImage.create({reviewId, url});

  const {id} = image;

  const result = await ReviewImage.findAll({
    where: {
      id
    }
  })
  res.json({
    result: {
      id,
      url
    }
  });
    }else{
      res.status(403).json({
        "message": "Maximum number of images for this resource was reached."
      });
    }
    
  }else{
    res.json({
      "message": "Review couldn't be found"
    });
  }
  
});

// Edit a Review
router.put('/reviews/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;
  const {review, stars} = req.body;

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
  if(_reviewId){
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
  res.json({
    newReview: {
      id: reviewId,
      spotId: spotId.spotId,
      userId: userId.userId,
      review,
      stars,
      createdAt: created['createdAt'],
      updatedAt: updated['updatedAt']
    }
  });
  }else{
    res.json({
      "message": "Review couldn't be found"
    });
  }
  
});

// Delete a Review
router.delete('/reviews/:reviewId', requireAuth, async (req, res) => {
  const reviewId = req.params.reviewId;

  const _reviewId = await Review.findByPk(reviewId);
  if(_reviewId){
    await Review.destroy({
    where: {
      id: reviewId
    }
  });

  res.status(200).json({
    "message": "Successfully deleted"
  });
  }else{
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
        model: Spot, attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
        'description', 'price', 'createdAt','updatedAt']
      },
    ]
  });

  // customized answer
  const spotImage = await SpotImage.findAll({
    attributes: ['url', 'preview'],
  });

  const formattdResult =  bookings.map(booking => {
    return {
      id: booking.id,
      spotId: booking.spotId,
      spot: {
        id: booking.Spot.id,
        ownerId: booking.Spot.reviewId,
        address: booking.Spot.address,
        city: booking.Spot.city,
        state: booking.Spot.state,
        country: booking.Spot.country,
        lat: booking.Spot.lat,
        lng: booking.Spot.lng,
        name: booking.Spot.name,
        price: booking.Spot.price,
        previewImage: spotImage[0] ? spotImage[0].url : null
      },
      userId: booking.userId,
      startDate: booking.startDate,
      endDate: booking.endDate,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    }
  });
  res.status(200).json({
    // bookings
    formattdResult
  });
});

// Get all Bookings for a Spot based on the Spot's id
router.get('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;

  const _spotId = await Spot.findByPk(spotId);

  if(_spotId){
    const booking = await Booking.findOne({
    attributes: ['id', 'startDate', 'endDate'],
    where: {
      spotId
    }
  });
  res.status(200).json({
      booking
  });
  }else{
    res.status(404).json({
      "message": "Spot couldn't be found"
    });
  }

  
});

// Create a Booking from a Spot based on the Spot's id
router.post('/spots/:spotId/bookings', requireAuth, async (req, res) => {
  const  spotId = req.params.spotId;
  const userId = req.user.id;
  const {startDate, endDate} = req.body;

  const _spotId = await Spot.findByPk(spotId);
  if(_spotId){
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
    if(existingBooking){
      res.status(403).json({
        "message": "Sorry, this spot is already booked for the specified dates"
      });
    }else{
        // success
        const booking = await Booking.create({spotId, userId, startDate, endDate});

        res.status(200).json({
          booking
        });
    }
  }else{
    res.status(404).json({
      "message": "Spot couldn't be found"
    });
  }
  
});

// Edit a Booking
// URL: /api/bookings/:bookingId
router.put('/bookings/:bookingId', requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;
  const {startDate, endDate} = req.body;

  const bookedDate = await Booking.findOne({where: {id: bookingId}, attributes: ['startDate']});
  const pastDate = bookedDate['startDate'];
  const currentDate = new Date();

  if(pastDate < currentDate){
    res.status(403).json({
      "message": "Past bookings can't be modified"
    });
  }else{
    const existingBooking = await Booking.findOne({
      where: {
        id: bookingId,
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

    if(existingBooking){
      res.status(403).json({
        "message": "Sorry, this spot is already booked for the specified dates"
      });
    }else{
        const _bookingId = await Booking.findByPk(bookingId);
          if(_bookingId){
            await Booking.update({startDate, endDate}, {
            where: {
              id: bookingId
            }
          });

          const _newBooking = await Booking.findOne({
            where: {
              id: bookingId
            }
          });

          res.status(200).json({
            _newBooking
          });
          }else{
            res.status(404).json({
              "message": "Booking couldn't be found"
            });
          }
    }
      
  }
  
  
});

// Delete a Booking
router.delete('/bookings/:bookingId', requireAuth, async (req, res) => {
  const bookingId = req.params.bookingId;

  const _bookingId = await Booking.findByPk(bookingId);
      if(_bookingId){
        const s = _bookingId['id'];
        const _startDate = await Booking.findOne({where: { id: s}, attributes: ['startDate']});
        const _startDate_ = _startDate['startDate'];
        const currentDate = new Date();
        if(_startDate_ <= currentDate){
          res.status(403).json({
            "message": "Bookings that have been started can't be deleted"
          });
        }else{
          await Booking.destroy({
          where: {
            id: bookingId
          }
        });

        res.status(200).json({
          "message": "Successfully deleted"
        });
        }
      
    }else{
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
  if(_imageId){
    await SpotImage.destroy({
    where: {
      id: imageId
    }
  });

  res.status(200).json({
    "message": "Successfully deleted"
  });
  }else{
    res.status(404).json({
      "message": "Spot Image couldn't be found"
    });
  }
  
});

// Delete a Review Image
router.delete('/review-images/:imageId', requireAuth, async (req, res) => {
  const imageId = req.params.imageId;

  const _imageId = await ReviewImage.findByPk(imageId);
  if(_imageId){
    await ReviewImage.destroy({
    where: {
      id: imageId
    }
  });

  res.status(200).json({
    "message": "Successfully deleted"
  });
  }else{
    res.status(404).json({
      "message": "Review Image couldn't be found"
    });
  }
  
});

module.exports = router;