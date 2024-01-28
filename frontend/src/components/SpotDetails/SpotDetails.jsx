
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadSpotDetailsfromDB } from '../../store/spot';
import { useEffect, useState } from 'react';
import Reviews from "../Reviews/Reviews";
import OpenModalButton from "../OpenModalButton";
import PostReviewModal from "../PostReviewModal/PostReviewModal";
import './SpotDetails.css'


const SpotDetails = () => {
    const {spotId} = useParams();
    const spot = useSelector(state => state.spots[spotId])
    const currentUser = useSelector(state => state.session.user)
    const allReviews = useSelector(state => Object.values(state.reviews))
    const reviewsForCurrentSpot = allReviews.filter(review => review.spotId === Number(spotId))
    const dispatch = useDispatch()

    const [hasReviewed, setHasReviewed] = useState(false)

    //fetch all the spot details info when loading a page
    useEffect(() => {
        //console.log(is spotActions called?)
        // dispatch(getSpotDetailThunk(spotId))
        dispatch(loadSpotDetailsfromDB(spotId))

    }, [dispatch, spotId])

    //check the reviews to see if the current user id match one of the review userId
    useEffect(() => {
        if (currentUser && spot && reviewsForCurrentSpot) {
            if (hasReviewed) {
                return;
            }

            reviewsForCurrentSpot.forEach((review) => {
                if (review.userId === currentUser?.id) {
                    setHasReviewed(true);
                }
            });
        }
    }, [currentUser, spot, reviewsForCurrentSpot, hasReviewed]);

    if (!spot) {
        return <div>Loading...</div>
      }

    const handleReserveClick = () => {
        alert ('Feature coming soon')
    }


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
                        <button className='spotdetail-reserve-button' onClick={handleReserveClick}>Reserve</button>
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

                {(currentUser && !hasReviewed && currentUser?.id !== spot?.Owner?.id) && (
                    <OpenModalButton
                        modalComponent={<PostReviewModal spotId={ spotId} />}
                        buttonText='Post Your Review'
                    />
                )}
            </div>
            <Reviews spotId={ spotId } setHasReviewed={setHasReviewed}/>
        </div>
    )
};

export default SpotDetails

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from 'react-redux';
// import { useParams } from 'react-router-dom';
// import Reviews from "../Reviews/Reviews";
// import OpenModalButton from "../OpenModalButton";
// import PostReviewModal from "../PostReviewModal/PostReviewModal";
// import './SpotDetails.css'
// import { loadSpotsfromDB } from "../../store/spot";

// const SpotDetails = () => {
//     const { spotId } = useParams();

//     const spot = useSelector(state => state.spots[spotId]);
//     // const spot = useSelector(state => state.spots);

//     const currentUser = useSelector(state => state.session.user);
//     const reviews = useSelector(state => Object.values(state.reviews));
//     const currentSpotReviews = reviews.filter(review => review.spotId == spotId);
//     const dispatch = useDispatch();

//     useEffect(() => {
//         // dispatch(loadSpotDetailsfromDB(spotId));
//         dispatch(loadSpotsfromDB())
//     }, [dispatch]);


//     // console.log('spot from SpotDetails.jsx: ', spot)



//     const [alreadyReviewd, setAlreadyReviewd] = useState(false);
//     // checking to see if the loggedin user has reviewed the current spot
//     useEffect(() => {
//         if (currentUser && spot && currentSpotReviews) {
//             if (alreadyReviewd) {
//                 return;
//             }
//             currentSpotReviews.forEach(review => {
//                 if (review.userId === currentUser?.id) {
//                     setAlreadyReviewd(true)
//                 }
//             })
//         }
//     }, [currentUser, spot, currentSpotReviews, alreadyReviewd]);


//     if(!spot){
//         return <i>Loading....</i>
//     }
    
//     return (

//         <div className='spotDetailContainer'>
//             {spot && (
//                 <div>
           
//             <div className="spotPhotos">
//                 <h1 className='spotTitle'>{spot.name}</h1>
//                 <h3 className='cityNstate'>{spot.city}, {spot.state}, {spot.country}</h3>
//                 <div className='spotDetail'>

//                     <div className="leftImage">
//                         {spot.SpotImages && <img
//                             className='imgLeft'
//                             src={spot.SpotImages[0]?.url}
//                             alt={spot.name}
//                         />}
//                     </div>

//                     <div className="rightImages">
//                         {spot.SpotImages?.length > 1 && <img
//                             className='tl'
//                             src={spot.SpotImages[1]?.url}
//                             alt={spot.name}
//                         />}
//                         {spot.SpotImages?.length > 2 && <img
//                             className='tr'
//                             src={spot.SpotImages[2]?.url}
//                             alt={spot.name}
//                         />}
//                         {spot.SpotImages?.length > 3 && <img
//                             className='br'
//                             src={spot.SpotImages[3]?.url}
//                             alt={spot.name}
//                         />}
//                         {spot.SpotImages?.length > 4 && <img
//                             className='bl'
//                             src={spot.SpotImages[4]?.url}
//                             alt={spot.name}
//                         />}
//                     </div>

//                 </div>
//             </div>


//             <div className="reviewSummaryInfo">
//                 <div className='hostDetails'>
//                     {spot.Owner && <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>}
//                     <p>{spot.description}</p>
//                 </div>
//                 <div className="callOutInfo">
//                     <div className='spotDetailInfoContainer'>
//                         <div className='spotdetailInfoCallout'>
//                             <div>${spot.price}/night</div>
//                             <div>
//                                 <i className='fas fa-star' />{spot.numReviews && !isNaN(spot.avgRating) ? spot.avgRating.toFixed(1) : 'NEW'}

//                                 {/* {spot.avgRating ? spot.avgRating.toFixed(1) : 'NEW'} */}
//                                 {spot.numReviews > 0 && (
//                                     <>
//                                         <span> · </span>
//                                         {spot.numReviews === 1 ? '1 Review' : `${spot.numReviews} Reviews`}
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                         <div className='spotdetail-reserve-button-container'>
//                             <button className='spotdetail-reserve-button' onClick={() => alert('Feature Coming Soon...')}>Reserve</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <hr className="horizontal-line" />
//             <div className="reviews">
//                 <div>
//                     <div>
//                         <h3 className='spotdetail-rating-dup'>
//                             <i className='fas fa-star' />
//                             {spot.avgRating ? spot.avgRating.toFixed(1) : 'NEW'}
//                             {spot.numReviews > 0 && (
//                                 <>
//                                     <span> · </span>
//                                     {spot.numReviews === 1 ? '1 Review' : `${spot.numReviews} Reviews`}
//                                 </>
//                             )}
//                         </h3>
//                     </div>

//                     {(currentUser && !alreadyReviewd && currentUser?.id !== spot?.Owner?.id) && (
//                         <OpenModalButton
//                             modalComponent={<PostReviewModal spotId={spotId} />}
//                             buttonText='Post Your Review'
//                         />
//                     )}
//                 </div>
//                 <Reviews spotId={spotId} setAlreadyReviewed={setAlreadyReviewd} />
//             </div>
//             </div>
//             )}
//         </div>
//     );
// }

// export default SpotDetails;