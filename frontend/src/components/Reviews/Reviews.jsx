import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadReviewsfromDB } from "../../store/review";
import OpenModalButton from '../OpenModalButton';

function Reviews({ spotId, setAlreadyReviewed }) {
    const reviews = useSelector(state => Object.values(state.reviews));
    const spotReviews = reviews.filter(reivew => reivew.spotId == spotId)
    const spotOwnerId = useSelector(state => state.spots[spotId].ownerId);
    const currentUserId = useSelector(state => state.session.user?.id);
    const dispacth = useDispatch();

    useEffect(() => {
        dispacth(loadReviewsfromDB(spotId));
    }, [dispacth, spotId]);
    return (
        <div>
            <h1>Reviews</h1>
            {spotReviews.map(review => (
                <div className="reviewContainer" id={review.id}>
                    <div>{review.User.firstName}</div>
                    <div>{new Date(review.createdAt).toLocaleString('en-US', {month: 'long', year: 'numeric'})}</div>
                    <div>{review.reivew}</div>
                    <div>{currentUserId == review?.User?.id && (
                        <OpenModalButton
                        modalComponent={<DeleteReviewModal reviewId ={review.id} spotId = {spotId} setAlreadyReviewed={setAlreadyReviewed} />}
                        buttonText='Delete'
                        />
                    )}</div>
                </div>
            ))}
        </div>
    );
}

export default Reviews;