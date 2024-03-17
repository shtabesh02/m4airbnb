import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSpotsfromDB } from '../../store/spot';
import { loadSpotsImagesFromDB } from '../../store/spotsimages';
// import { loadSpotDetailsfromDB } from '../../store/spot_details';
import { NavLink } from 'react-router-dom';
import './spots.css';


// ---------------------------------
// Swiper section
import { Swiper, SwiperSlide } from 'swiper/react';
<script type="module" src="/src/main.jsx"></script>

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';


// import required modules
import { Keyboard, Pagination, Navigation } from 'swiper/modules';
// ---------------------------------

const Spots = () => {
    const allSpots = useSelector(state => Object.values(state.spots));
    const spotsimages = useSelector(state => (state.spotsimages))
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(loadSpotsfromDB());
        dispatch(loadSpotsImagesFromDB())
    }, [dispatch]);


    // if (!spotImages) {
    //     return <p>Loading...</p>
    // }

    return (

            <div className='theSpotContainer'>
                {allSpots.map((spot) => (
                    <div key={spot.id} className='individualSpotContainer'>
                        <NavLink className="nav-link" to={`/spots/${spot.id}`}>
                            <div className="spotPhoto">
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={30}
                                    keyboard={{
                                        enabled: false,
                                    }}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    navigation={true}
                                    modules={[Keyboard, Pagination, Navigation]}
                                    className="mySwiper"
                                >
                                    {Object.values(spotsimages).map((spotimage) => (
                                        spot.id === spotimage.id && spotimage.SpotImages ? (
                                            spotimage.SpotImages.map((image, index) => (
                                                <SwiperSlide key={`${spotimage.id}-${index}`}>
                                                    <img src={image.url} alt={`Spot ${spotimage.id} Image ${index}`} />
                                                </SwiperSlide>
                                            ))
                                        ) : null
                                    ))}
                                </Swiper>
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
                    </div>
                ))}
            </div>

    );
}

export default Spots;