import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Reviews from "../Reviews/Reviews";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import './SpotDetails.css'
import { loadSpotDetailsfromDB } from "../../store/spot";

const SpotDetails = () => {
    const { spotId } = useParams();


    // console.log('spotId: ', spotId)
    const spot = useSelector(state => state.spots[spotId])

    // console.log('spot: ', spot);


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(loadSpotDetailsfromDB(spotId))
    }, [dispatch, spotId]);
    // Number.parseFloat(x).toFixed(2)
    // const avgRating = Number(spot?.avgRating); // works fine
    const avgRating = Number.parseFloat(spot?.avgRating).toFixed(1);
    const numReviews = Number(spot?.numReviews);

    // console.log('spot.numReviews: ', numReviews);
    // console.log('spot.avgRating: ', avgRating);

    const currentUser = useSelector(state => state.session.user);
    const reviews = useSelector(state => Object.values(state.reviews));
    const currentSpotReviews = reviews.filter(review => review.spotId == spotId);


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


    if (!spot) {
        // console.log('!spot: ', spot)
        return <i>Loading....</i>
    }

    return (

        <div className='spotDetailContainer'>
            <div className="spotinformation">
                <h1>{spot.name}</h1>
                <p>{spot.city}, {spot.state}, {spot.country}</p>
            </div>

            <div className='spotDetail'>

                <div className="leftImage">
                    {spot.SpotImages && <img
                        className='imgLeft'
                        src={spot.SpotImages[0]?.url}
                        alt={spot.name}
                    />}
                </div>

                <div className="rightImages">
                    {spot.SpotImages?.length > 1 && <img
                        className='tl'
                        src={spot.SpotImages[1]?.url}
                        alt={spot.name}
                    />}
                    {spot.SpotImages?.length > 2 && <img
                        className='tr'
                        src={spot.SpotImages[2]?.url}
                        alt={spot.name}
                    />}
                    {spot.SpotImages?.length > 3 && <img
                        className='br'
                        src={spot.SpotImages[3]?.url}
                        alt={spot.name}
                    />}
                    {spot.SpotImages?.length > 4 && <img
                        className='bl'
                        src={spot.SpotImages[4]?.url}
                        alt={spot.name}
                    />}
                </div>

            </div>



            <div className="reviewSummaryInfo">

                <div className='hostDetails'>
                    {spot.Owner && <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>}
                    <p>{spot.description}</p>
                </div>

                <div className="callOutInfo">
                    <div className='spotdetailInfoCallout'>
                        <div>${spot.price}/night</div>
                        <div>
                            <i className='fa-solid fa-star' />

                            {spot.avgRating ? avgRating : 'NEW'}

                            {numReviews > 0 && (
                                <>
                                    <span> · </span>
                                    {numReviews == 1 ? '1 Review' : `${numReviews} Reviews`}
                                </>
                            )}
                        </div>
                    </div>
                    <div className='reserveIt'>
                        <button className='spotdetail-reserve-button' onClick={() => alert('Feature Coming Soon...')}>Reserve</button>
                    </div>
                </div>
            </div>

            <hr className="horizontal-line" />
            <div className="reviews">
                <div>
                    <div>

                        <h3 className='spotdetail-rating-dup'>
                            <i className='fa-solid fa-star' />
                            {spot.avgRating ? avgRating : 'NEW'}
                            {spot.numReviews > 0 && (
                                <>
                                    <span> · </span>
                                    {numReviews == 1 ? '1 Review' : `${numReviews} Reviews`}
                                </>
                            )}
                        </h3>
                    </div>

                    {(currentUser && !alreadyReviewd && currentUser?.id !== spot?.Owner?.id) && (
                        <OpenModalButton
                            modalComponent={<PostReviewModal spotId={spotId} />}
                            buttonText='Post Your Review'
                        />
                    )}
                </div>
                <Reviews spotId={spotId} setAlreadyReviewed={setAlreadyReviewd} />
            </div>


        </div>
    );
}

export default SpotDetails;