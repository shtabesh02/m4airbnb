import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useModal } from '../../context/Modal';
import './UpdateReviewModal.css'

import RatingStars from './RatingStar';
import { loadReviewsfromDB, updateCurrentReview } from '../../store/review';

const UpdateReviewModal =  ({ spotId, reviewId}) => {

    // const spotId = 1;
    // console.log('spotId from UpdateReviewModal: ', spotId)
    const dispatch = useDispatch();
    // const navigate = useNavigate();
    //const sessionUser = useSelector((state) => state.session.user);
    const reviews = useSelector(state => Object.values(state.reviews));
    // console.log('reviews: ', reviews)


    const currentReview = reviews.filter(review => review.id == reviewId)
    const [review, setReview] = useState(currentReview[0].review);
    const [rating, setRating] = useState(currentReview[0].stars);
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    //console.log(spotId)


    useEffect(() => {
        dispatch(loadReviewsfromDB(spotId));
    }, [dispatch, spotId, reviewId]);


    const onChange = (num) => {
        setRating(num);
    };

    const updateReview = async (e) => {
        // console.log('Update Review Called');
        e.preventDefault();
        setErrors({});

        const updatedReview = {
            review,
            stars: rating
        }
        await dispatch(updateCurrentReview(updatedReview, reviewId))
          .then(closeModal)
    };
    return (
        <div className='reviewContainerForm'>
            <h1>How was your Stay at -SpotName- ?</h1>
                {errors.message && (
                <p className=''>{errors.message}</p>
            )}
            {errors.review && (<div className='requiredInput'>{errors.review}</div>)}
            <form className='form' onSubmit={updateReview}>
                <textarea className='reviewText'
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    name='review'
                    rows='5'
                >
                </textarea>

                {errors.stars && (<div className='newspot-form-required-input'>{errors.stars}</div>)}

                <RatingStars rating={rating} onChange={onChange}/>
              
              
                <button className={`${review.length < 10 || rating < 1 ? 'disabled' : 'submitReview'}`}
                    type='button'
                    disabled={review.length < 10 || rating < 1}
                    onClick={updateReview}
                >
                    Update Your Review
                </button>


            </form>
        </div>
    )
}

export default UpdateReviewModal;