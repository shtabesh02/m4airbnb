import { useEffect, useState } from "react";
import { loadSpotsfromDB, updateCurrentSpot } from "../../store/spot";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import './UpdateSpot.css';

const UpdateSpot = () => {

    const {spotId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const spots = useSelector(state => Object.values(state.spots));
    const currentSpot = spots.filter(spot => spot.id == spotId);

    // console.log('spots from updates: ', spots);
    // console.log('current spot: ', currentSpot);
    // console.log('spotId: ', spotId);
    // console.log('currentSpot country: ', currentSpot[0].country);


    const [country, setCountry] = useState(currentSpot[0].country);
    const [address, setAddress] = useState(currentSpot[0].address);
    const [city, setCity] = useState(currentSpot[0].city);
    const [state, setState] = useState(currentSpot[0].state);
    const [lat, setLat] = useState(currentSpot[0].lat);
    const [lng, setLng] = useState(currentSpot[0].lng);
    const [description, setDescription] = useState(currentSpot[0].description);
    const [spotTitle, setSpotTitle] = useState(currentSpot[0].name);
    const [price, setPrice] = useState(currentSpot[0].price);
    // const [url1, setUrl1] = useState();
    // const [url2, setUrl2] = useState();
    // const [url3, setUrl3] = useState();
    // const [url4, setUrl4] = useState();
    // const [url5, setUrl5] = useState();

    const [err, setErr] = useState({});
    // const [imgErr, setImgErr] = useState({});

    useEffect(() => {
        dispatch(loadSpotsfromDB());
    }, [dispatch]);


    // handling submission of new spot
    const updateTheSpot = async (e) => {
        e.preventDefault();
        setErr({});
        // setImgErr({});
        const newSpotDetails = {
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name: spotTitle,
            price
        }
        // console.log('New Spot Details: ', newSpotDetails);
        // console.log('price: ', price)
        
        if(!price){
            setErr({price: 'Price is required.'})
        }
        if(!description || description.length < 30){
            setErr({...(err) || {}, description: 'Descriotion needs a minimum of 30 characters.'});
            // return;
        }
        
        // console.log('errr: ', err);

        // Checking if any validation error exists
        if(Object.keys(err).length !== 0){
            return;
        }
        // calling insert Thunk action creator
    
        let result = await dispatch(updateCurrentSpot(newSpotDetails, spotId))
                     .catch(async (result) => {
                        const data = await result.json();
                        // console.log('calling insertNewSpot thunk form NewSpot.jsx', data);
                        if(data && data.message){
                            setErr(data.errors)
                            if(data.message === `value too long for type character varying(255)`){
                                setErr({description: data.message})
                            }
                            return;
                        }
                     });
                     if(result.id){
                        navigate(`/spots/${result.id}`)
                     }
    }

    return (
        <div className="newSpotContainer">
            <h1>Update your Spot</h1>
            <form onSubmit={updateTheSpot} className="newSpotForm">
                <div className="spotLocation firstSection">
                    <h2>Where&apos;s your place located?</h2>
                    <p>
                        Guests will only get your exact address once they booked a reservation.
                    </p>

                    <label htmlFor="country">Country</label>
                    <input type="text" id="country" value={country} onChange={e => setCountry(e.target.value)} />

                    <label htmlFor="streetAddress">Street Address</label>
                    <input type="text" name="streetAddress" id="streetAddress" value={address} onChange={e => setAddress(e.target.value)} />

                    <div className="cityNstate">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" value={city} onChange={e => setCity(e.target.value)} />
                        <span>,</span>
                        <label htmlFor="state">State</label>
                        <input type="text" name="state" id="state" value={state} onChange={e => setState(e.target.value)} />
                    </div>
                    <div className="lat-long">
                        <label htmlFor="lat">Latitude</label>
                        <input type="text" id="lat" value={lat} onChange={e => setLat(e.target.value)} />
                        <span>,</span>
                        <label htmlFor="lng">Longitude</label>
                        <input type="text" name="lng" id="long" value={lng} onChange={e => setLng(e.target.value)} />
                    </div>
                </div>
                <div className="description secondSection">
                    <h2>Describe your place to guests</h2>
                    <p>
                        Mention the best features of your space, any special amentities like fase wifi or parking, and what you love about the neighborhood.
                    </p>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} name="spaceDescription" id="spaceDescription" cols="30" rows="10" placeholder="Please write at least 30 characters."></textarea>
                    <span className="errors">{err.description && err.description}</span>
                </div>
                <div className="spotTitle thirdSection">
                    <h2>Create a title for your spot</h2>
                    <p>
                        Catch guests&apos; attention with a spot title that highlights what makes your place special.
                    </p>
                    <input value={spotTitle} onChange={e => setSpotTitle(e.target.value)} type="text" placeholder="Name of your spot" />
                </div>
                <div className="baseprice fourthSection">
                    <h2>Set a base price for your spot</h2>
                    <p>
                        Competitive pricing can help hyour listing stand out and rank higher in search results.
                    </p>
                    <div className="priceSign">
                        <span>$</span>
                        <input value={price} onChange={e => setPrice(e.target.value)} type="text" placeholder="Price per night (USD)" />
                    </div>
                        <span className="errors">{err.price && err.price}</span>
                </div>
                <div className="submitSection">
                    <button>Update Spot</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateSpot;