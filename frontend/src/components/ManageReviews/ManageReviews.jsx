import { useDispatch, useSelector } from "react-redux";
// import Reviews from "../Reviews/Reviews";
// import { useNavigate } from "react-router-dom";
import { loadCurrentUserReviewfromDB } from "../../store/review";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton";
import DeleteReviewModal from "../DeleteReview/DeleteReviewModal";
import UpdateReviewModal from "../UpdateReviewModal/UpdateReviewModal";

const ManageReviews = () => {
    

    const currentUser = useSelector(state => state.session.user.id);
    // console.log('currentUser: ', currentUser);
    const dispatch = useDispatch();
    // const navigate = useNavigate();

    const allReviews = useSelector(state => Object.values(state.reviews))
    const currentUserReviews = allReviews.filter(review => review.userId == currentUser)

    const sortedReviews = currentUserReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // console.log('reviews: ', sortedReviews)

    useEffect(() => {
        dispatch(loadCurrentUserReviewfromDB());
    }, [dispatch]);

    // const updateReview = (reviewId) => {
    //     navigate(`/reviews/${reviewId}`)
    // }

    return(
        <div>
            <h1>Manage Reviews</h1>
            {sortedReviews.map(review => (
                    <div className='reviewContainer' key={review.id}>
                        <div>{review.User.firstName}</div>
                        <div>{new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</div>
                        <div>{review.review}</div>
                        <div>

                        {(currentUser && currentUser?.id !== review?.User?.id) && (
                        <OpenModalButton
                            modalComponent={<UpdateReviewModal spotId={review.spotId} reviewId={review.id}/>}
                            buttonText='Update'
                        />
                    )}

                            {currentUser === review?.User?.id && (
                                
                            <OpenModalButton
                                modalComponent={<DeleteReviewModal reviewId={review.id} />}
                                buttonText='Delete'
                            />
                            )}
                        </div>
                    </div>
            ))}
        </div>
    );
}

export default ManageReviews;