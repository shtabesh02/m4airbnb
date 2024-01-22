import { useEffect, useState } from "react";
import {useDispatch, useSelector} from 'react-redux';
import { useParams } from 'react-router-dom';
import { loadSpotDetailsfromDB } from "../../store/spot";
import Reviews from "../Reviews/Reviews";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal/PostReviewModal";

function SpotDetails(){
    const {spotId} = useParams();
    const spot = useSelector(state => Object.values(state.spots[spotId]));
    // const allSpots = useSelector(state => Object.values(state.spots));
    const currentUser = useSelector(state => state.session.user);
    console.log('spot from SpotDetails.jsx: ', spot)
    const reviews = useSelector(state => Object.values(state.reviews));
    const currentSpotReviews = reviews.filter(review => review.spotId == spotId);
    const dispatch = useDispatch();

    const [alreadyReviewd, setAlreadyReviewd] = useState(false);
    // load all the spot details
    useEffect(()=> {
        dispatch(loadSpotDetailsfromDB(spotId))
    }, [dispatch, spotId]);

    // checking the revies of the current user
    useEffect(() => {
        if(currentUser && spot && currentSpotReviews){
            if(alreadyReviewd){
                return;
            }
            currentSpotReviews.forEach(review => {
                if(review.userId === currentUser?.id){
                    setAlreadyReviewd(true)
                }
            })
        }
    }, [currentUser, spot, currentSpotReviews, alreadyReviewd]);
    return (
        <div className='spotdetail'>
            <h1 className='spotdetail-title'>{spot.name}</h1>
            <h3 className='spotdetail-city-state'>{spot.city}, {spot.state}, {spot.country}</h3>
            <div className='spotdetail-pictures-container'>

                {spot.SpotImages && <img
                    className='spotdetail-img-left'
                    src={spot.SpotImages[0]?.url}
                    title={spot.name}
                    alt={spot.name}
                />}

                {spot.SpotImages?.length > 1 && <img
                    className='spotdetail-img-right-2'
                    src={spot.SpotImages[1]?.url}
                    title={spot.name}
                    alt={spot.name}
                />}
                {spot.SpotImages?.length > 2 && <img
                    className='spotdetail-img-right-3'
                    src={spot.SpotImages[2]?.url}
                    title={spot.name}
                    alt={spot.name}
                />}
                {spot.SpotImages?.length> 3 && <img
                    className='spotdetail-img-right-4'
                    src={spot.SpotImages[3]?.url}
                    title={spot.name}
                    alt={spot.name}
                />}
                {spot.SpotImages?.length> 4 && <img
                    className='spotdetail-img-right-5'
                    src={spot.SpotImages[4]?.url}
                    title={spot.name}
                    alt={spot.name}
                />}

            </div>


            <div className='spotdetail-info'>
                <div className='spotdetail-info-host'>
                {spot.Owner && <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>}
                    <p>{spot.description}</p>
                </div>
                <div className='spotdetail-info-container'>
                    <div className='spotdetail-info-callout'>
                        <div>${spot.price}/night</div>
                        <div>
                            <i className='fas fa-star' />
                            {spot.avgRating ? spot.avgRating.toFixed(1) : 'NEW'}
                            {spot.numReviews > 0 && (
                                <>
                                    <span> · </span>
                                    {spot.numReviews === 1 ? '1 Review': `${spot.numReviews} Reviews`}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='spotdetail-reserve-button-container'>
                        {/* <button className='spotdetail-reserve-button' onClick={handleReserveClick}>Reserve</button> */}
                        <button className='spotdetail-reserve-button' onClick={() => alert('coming soon')}>Reserve</button>
                    </div>

                </div>
            </div>
            <div>
                <h3 className='spotdetail-rating-dup'>
                    <i className='fas fa-star' />
                    {spot.avgRating ? spot.avgRating.toFixed(1) : 'NEW'}
                    {spot.numReviews > 0 && (
                        <>
                            <span> · </span>
                            {spot.numReviews === 1 ? '1 Review': `${spot.numReviews} Reviews`}
                        </>
                    )}
                </h3>
            </div>

            <div>
 

                {/* hasReviewed is not updated when the post is deleted, hence the postReviewModal doesnt show when a user hasnt posted one */}
                {(currentUser && !alreadyReviewd && currentUser?.id !== spot?.Owner?.id) && (
                    <OpenModalButton
                        modalComponent={<PostReviewModal spotId={ spotId} />}
                        buttonText='Post Your Review'
                    />
                )}
            </div>

            {/* render all the reviews asscociated with the Spot */}
            <Reviews spotId={ spotId } setAlreadyReviewed={setAlreadyReviewd}/>
        </div>
    );
}

export default SpotDetails;