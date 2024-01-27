import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadReviewsfromDB } from "../../store/review";
import { loadSpotDetailsfromDB, loadSpotsfromDB } from '../../store/spot';
// import './Reviews.css'; // create this css file later
import OpenModalButton from  '../OpenModalButton/OpenModalButton'
import DeleteReviewModal from '../DeleteReview/DeleteReviewModal';

const Reviews = ({spotId, setAlreadyReviewed}) => {

    const allReviews = useSelector(state => Object.values(state.reviews))
    const reviews = allReviews.filter(review => review.spotId === Number(spotId))

    const spot = useSelector(state => state.spots[spotId]);

    const spotOwnerId = useSelector(state => state.spots[spotId]?.ownerId);


    // console.log('spot owner id: ', spotOwnerId)
    
    const currentUserId = useSelector(state => state.session.user?.id)
    
    const dispatch = useDispatch();


    // soring reviews descending
    const sortedReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    // useEffect(() => {
    //     if (!spotOwnerId) {
    //         dispatch(loadSpotDetailsfromDB(spotId));
    //     }
    // }, [dispatch,spotOwnerId, spot, spotId]);


    // console.log('spot from Reviews.jsx: ', spot)

    useEffect(() => {
        dispatch(loadReviewsfromDB(spotId));
        dispatch(loadSpotDetailsfromDB(spotId));
    }, [dispatch, spotId])
    
    useEffect(()=> {
        if(!spotOwnerId || !spotId){
            dispatch(loadSpotsfromDB());
        }
    },[spotOwnerId]);


    // If no reviews is found, and logged in user is not the owner
    if (spotId && reviews.length === 0 && currentUserId !== spotOwnerId) {
        return <div><h2>Be the first to post a review!</h2></div>
    }


    //return the reviews when found
    return (
        <div>
            {sortedReviews.map(review => (
                    <div className='reviewContainer' key={review.id}>
                        <div>{review.User.firstName}</div>
                        <div>{new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</div>
                        <div>{review.review}</div>
                        <div>
                            {currentUserId === review?.User?.id && (
                            <OpenModalButton
                                modalComponent={<DeleteReviewModal reviewId={review.id} spotId= {spotId} setAlreadyReviewed={setAlreadyReviewed}/>}
                                buttonText='Delete'
                            />
                            )}
                        </div>
                    </div>
            ))}
        </div>
    )
};

export default Reviews;