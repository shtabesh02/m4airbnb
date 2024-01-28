import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { loadCurrentSpotsfromDB } from "../../store/spot";
import OpenModalButton from '../OpenModalButton/OpenModalButton';

import './ManageSpots.css'
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";

const ManageSpot = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state => state.session.user.id);
    const unfilteredSpots = useSelector(state => Object.values(state.spots));
    // console.log('currentUser: ', currentUser);
    // console.log('unfilteredSpots: ', unfilteredSpots);
    const spots = unfilteredSpots.filter(spot => spot.ownerId == currentUser);

    // console.log('spots: ', spots);



    useEffect(() => {
        dispatch(loadCurrentSpotsfromDB());
    }, [dispatch]);   // when the spots was in dependency, it was working but a loop was there.

    const updateSpot = (spotId) => {
        navigate(`/spots/${spotId}/edit`)

    }

    if(!spots){
        return <h3>Loading...</h3>
    }

    return(
        <div>
            <h1>Manage Your Spots</h1>   
            <NavLink to={`/spots/newSpot`}>Create a New Spot</NavLink>
            <div className='theSpotContainer'>
                {spots.map((spot) => (
                    
                    <div key={spot.id} className='individualSpotContainer'>
                        <NavLink className="nav-link" to={`/spots/${spot.id}`}>
                        <div className="spotPhoto">
                            <img
                                src={spot.previewImage}
                                alt={spot.name} />
                        </div>
                        <div className="spotInfo">
                            <div className="city-and-rating">
                                <div>
                                    {spot.city}, {spot.state}
                                </div>
                                <div>
                                    <i>{spot.avgRating} star</i>
                                </div>
                            </div>
                            <div className="price">
                                ${spot.price} night
                            </div>
                        </div>
                        </NavLink>
                        <div className="updateDelete">
                            <button onClick={() => updateSpot(spot.id)}>Update</button>
                            
                            <OpenModalButton modalComponent={<DeleteSpotModal spotId={spot.id} buttonText='Delete' />} buttonText='Delete'/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ManageSpot;