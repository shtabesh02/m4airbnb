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

import './styles.css';

// import required modules
import { Keyboard, Pagination, Navigation } from 'swiper/modules';

// ---------------------------------



// import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade'
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './styles.css';

// import { Navigation, EffectFade, Pagination } from 'swiper/modules';


const Spots = () => {
    // const [spotImages, setSpotImages] = useState([]);
    // const [loadSpot, setSpotImagesLoaded] = useState(false);
    const allSpots = useSelector(state => Object.values(state.spots));
    const spotsimages = useSelector(state => (state.spotsimages))
    // console.log('spotsimages: ', spotsimages)
    // console.log('All spots from Spots.jsx: ', allSpots);
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(loadSpotsfromDB());
        dispatch(loadSpotsImagesFromDB())
    }, [dispatch]);


    // if (!spotImages) {
    //     return <p>Loading...</p>
    // }

    return (
        <div>
            <div className='theSpotContainer'>
                {allSpots.map((spot) => (
                    <div key={spot.id} className='individualSpotContainer'>
                        <NavLink className="nav-link" to={`/spots/${spot.id}`}>

                            <div className="spotPhoto">
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={30}
                                    keyboard={{
                                        enabled: true,
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
                        {/* <NavLink className="nav-link" to={`/spots/${spot.id}`}>
                            <div className="spotPhoto">
                                {
                                    spotImages[index] ? (
                                        <Swiper
                                            spaceBetween={30}
                                            effect={'fade'}
                                            navigation={true}
                                            pagination={{
                                                clickable: true,
                                            }}
                                            modules={[EffectFade, Navigation, Pagination]}
                                            className="mySwiper">
                                            {
                                                spotImages[index].map((imageUrl, imageIndex) => (
                                                    <SwiperSlide key={imageIndex}>
                                                        <img src={imageUrl} alt={spot.name} title={spot.name} />
                                                    </SwiperSlide>
                                                ))
                                            }
                                        </Swiper>
                                    ) : (
                                        <img src={spot.previewImage} alt={spot.name} title={spot.name} />
                                        )
                                    }
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
                        </NavLink> */}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Spots;