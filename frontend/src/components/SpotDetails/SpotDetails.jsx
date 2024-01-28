import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadSpotDetailsfromDB } from "../../store/spot";
import Reviews from "../Reviews/Reviews";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import './SpotDetails.css'

function SpotDetails() {
    const { spotId } = useParams();
    // const spot = useSelector(state => Object.values(state.spots[spotId]));
    const spot = useSelector(state => state.spots[spotId]);
    // const allSpots = useSelector(state => Object.values(state.spots));

    const currentUser = useSelector(state => state.session.user);
    const reviews = useSelector(state => Object.values(state.reviews));
    const currentSpotReviews = reviews.filter(review => review.spotId == spotId);
    const dispatch = useDispatch();



    // load all the spot details
    // useEffect(()=> {
    //     dispatch(loadSpotDetailsfromDB(spotId))
    // }, [dispatch, spotId]);

    useEffect(() => {
        if (!spot) {
            dispatch(loadSpotDetailsfromDB(spotId));
        }
    }, [dispatch, spot, spotId]);


    // console.log('spot from SpotDetails.jsx: ', spot)



    const [alreadyReviewd, setAlreadyReviewd] = useState(false);
    // checking to see if the loggedin user has reviewed the current spot
    useEffect(() => {
        if (currentUser && spot && currentSpotReviews) {
            if (alreadyReviewd) {
                return;
            }
            currentSpotReviews.forEach(review => {
                if (review.userId === currentUser?.id) {
                    setAlreadyReviewd(true)
                }
            })
        }
    }, [currentUser, spot, currentSpotReviews, alreadyReviewd]);

    return (
        <div className='spotDetailContainer'>
            <div className="spotPhotos">
                <h1 className='spotTitle'>{spot && spot.name}</h1>
                <h3 className='cityNstate'>{spot && spot.city}, {spot && spot.state}, {spot && spot.country}</h3>
                <div className='spotDetail'>

                    <div className="leftImage">
                        {spot && spot.SpotImages && <img
                            className='imgLeft'
                            src={spot && spot.SpotImages[0]?.url}
                            alt={spot && spot.name}
                        />}
                    </div>

                    <div className="rightImages">
                        {spot && spot.SpotImages?.length > 1 && <img
                            className='tl'
                            src={spot && spot.SpotImages[1]?.url}
                            alt={spot && spot.name}
                        />}
                        {spot && spot.SpotImages?.length > 2 && <img
                            className='tr'
                            src={spot && spot.SpotImages[2]?.url}
                            alt={spot && spot.name}
                        />}
                        {spot && spot.SpotImages?.length > 3 && <img
                            className='br'
                            src={spot && spot.SpotImages[3]?.url}
                            alt={spot && spot.name}
                        />}
                        {spot && spot.SpotImages?.length > 4 && <img
                            className='bl'
                            src={spot && spot.SpotImages[4]?.url}
                            alt={spot && spot.name}
                        />}
                    </div>

                </div>
            </div>


            <div className="reviewSummaryInfo">
                <div className='hostDetails'>
                    {spot && spot.Owner && <h2>Hosted by {spot && spot.Owner.firstName} {spot && spot.Owner.lastName}</h2>}
                    <p>{spot && spot.description}</p>
                </div>
                <div className="callOutInfo">
                    <div className='spotDetailInfoContainer'>
                        <div className='spotdetailInfoCallout'>
                            <div>${spot && spot.price}/night</div>
                            <div>
                                <i className='fas fa-star' />{spot && spot.numReviews && !isNaN(spot.avgRating) ? spot.avgRating.toFixed(1) : 'NEW'}

                                {/* {spot && spot.avgRating ? spot.avgRating.toFixed(1) : 'NEW'} */}
                                {spot && spot.numReviews > 0 && (
                                    <>
                                        <span> · </span>
                                        {spot && spot.numReviews === 1 ? '1 Review' : `${spot && spot.numReviews} Reviews`}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className='spotdetail-reserve-button-container'>
                            <button className='spotdetail-reserve-button' onClick={() => alert('Feature Coming Soon...')}>Reserve</button>
                        </div>
                    </div>
                    </div>
            </div>

            <hr className="horizontal-line" />
            <div className="reviews">
                <div>
                    <div>
                        <h3 className='spotdetail-rating-dup'>
                            <i className='fas fa-star' />
                            {spot && spot.avgRating ? spot.avgRating.toFixed(1) : 'NEW'}
                            {spot && spot.numReviews > 0 && (
                                <>
                                    <span> · </span>
                                    {spot && spot.numReviews === 1 ? '1 Review' : `${spot && spot.numReviews} Reviews`}
                                </>
                            )}
                        </h3>
                    </div>
                   
                    {(spot && currentUser && !alreadyReviewd && currentUser?.id !== spot?.Owner?.id) && (
                        <OpenModalButton
                            modalComponent={<PostReviewModal spotId={spotId} />}
                            buttonText='Post Your Review'
                        />
                    )}
                </div>
            <Reviews spotId={ spotId } setAlreadyReviewed={setAlreadyReviewd}/>
            </div>
        </div>
    );
}

export default SpotDetails;