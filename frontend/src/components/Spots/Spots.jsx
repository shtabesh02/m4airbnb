import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSpotsfromDB } from '../../store/spot';
import {NavLink} from 'react-router-dom';
import './spots.css';

const Spots = () => {
    const allSpots = useSelector(state => Object.values(state.spots));
    // console.log('All spots from Spots.jsx: ', allSpots);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadSpotsfromDB())
    }, [dispatch]);
    // console.log('from Spots.jsx', allSpots)
  
    return (
        <div> 
            <div className='theSpotContainer'>
                {allSpots && allSpots.map((spot) => (
                    <div key={spot.id} className='individualSpotContainer'>
                        {spot &&(
                            <NavLink className="nav-link" to={`/spots/${spot.id}`}>
                            <div className="spotPhoto">
                                <img
                                    src={spot.previewImage}
                                    alt={spot.name}
                                    title={spot.name} />
                            </div>
                            <div className="spotInfo">
                                <div className="city-and-rating">
                                    <div>
                                        {spot.city}, {spot.state}
                                    </div>
                                    <div>
                                    
                                        <i className='fa-solid fa-star' />{spot.avgRating ? Number.parseFloat(spot.avgRating).toFixed(1) : 'NEW'}
                                    </div>
                                </div>
                                <div className="price">
                                    ${spot.price} night
                                </div>
                            </div>
                            </NavLink>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Spots;