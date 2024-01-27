import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './DeleteSpotModal.css'
import { deleteSpotFromDB } from '../../store/spot';

const DeleteSpotModal =  ({spotId}) => {

    const dispatch = useDispatch();

    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();
    //console.log(spotId)
    const handleConfirmSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        return dispatch(deleteSpotFromDB(spotId))
          .then(closeModal)
          .catch(async (res) => {
            if (res && res.message) {
                setErrors(res);
            }
        });
    };
    const handleCancelSubmit = (e) => {
        e.preventDefault();
        closeModal()
    };


    return (
        <div className='deletespot-confirm-container'>
            <h1>Confirm Delete</h1>

            {errors.message && (
                <p className=''>{errors.message}</p>
            )}

            <p>
                Are you sure you want to remove this spot?
            </p>

            <button
                className='deletespot-confirm-button'
                type='button'
                onClick={handleConfirmSubmit}
            >
                Yes (Delete Spot)
            </button>

            <button
                className='deletespot-cancel-button'
                type='button'
                onClick={handleCancelSubmit}
            >
                No (Keep Spot)
            </button>

        </div>
    )
}

export default DeleteSpotModal;