import { useState } from "react";
import { insertNewImage, insertNewSpot } from "../../store/spot";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import './NewSpot.css';

const NewSpot = () => {
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [spotTitle, setSpotTitle] = useState('');
    const [price, setPrice] = useState();
    const [url1, setUrl1] = useState('');
    const [url2, setUrl2] = useState('');
    const [url3, setUrl3] = useState('');
    const [url4, setUrl4] = useState('');
    const [url5, setUrl5] = useState('');

    const [err, setErr] = useState({});
    const [imgErr, setImgErr] = useState({});


    const dispatch = useDispatch();
    const navigate = useNavigate();


    // handling submission of new spot
    const submitNewSpot = async (e) => {
        e.preventDefault();
        setErr({});
        setImgErr({});
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
        console.log('New Spot Details: ', newSpotDetails);
        console.log('price: ', price)
        
        if(!price){
            setErr({price: 'Price is required.'})
        }
        if(!description || description.length < 30){
            setErr({...(err) || {}, description: 'Descriotion needs a minimum of 30 characters.'});
            // return;
        }

        if (!url1) {
            setImgErr({imageRequired: 'Preview image is required.' });
            // return;
        }
        
        console.log('errr: ', err);
        console.log('erri: ', imgErr);

        // if (url1.toLowerCase().endsWith('.png') ||
        //     url1.toLowerCase().endsWith('.jpg') ||
        //     url1.toLowerCase().endsWith('.jpeg')) {
        //         // return
        //     }else{
        //         setImgErr({ ...imgErr || {}, extension: 'Image URL must end in .png, .jpg, or .jpeg' })
        // }

        // Checking if any validation error exists
        if(Object.keys(err).length !== 0 || Object.keys(imgErr).length !== 0){
            return;
        }
        // calling insert Thunk action creator
    
        let result = await dispatch(insertNewSpot(newSpotDetails))
                     .catch(async (result) => {
                        const data = await result.json();
                        console.log('calling insertNewSpot thunk form NewSpot.jsx', data);
                        if(data && data.message){
                            setErr(data.errors)
                            if(data.message === `value too long for type character varying(255)`){
                                setErr({description: data.message})
                            }
                            return;
                        }
                     })

                     if(result?.id){
                        const spotId = result.id;
                        const photoUrls = [url1, url2, url3, url4, url5].filter(url => url !== undefined);


                        for (const url of photoUrls){
                            const newImages = {
                                url,
                                preview: true,
                            }
                            if(url){
                                await dispatch(insertNewImage(newImages, spotId)); // call the add image thunk action creator.
                            }
                        }

                        // After insertion, empty the form
                        setCountry('');

                        navigate(`/spots/${result.id}`)
                     }
    }

    return (
        <div className="newSpotContainer">
            <h1>Create a New Spot</h1>
            <form onSubmit={submitNewSpot} className="newSpotForm">
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
                <div className="spotPhoto fifthSection">
                    <h2>Liven up your spot with photos</h2>
                    <p>
                        Submit a link to at least one photo to publish your spot.
                    </p>
                    <input value={url1} onChange={e => setUrl1(e.target.value)} type="text" placeholder="Preview Image URL" />
                    <span className="errors">{imgErr.imageRequired && imgErr.imageRequired}</span><span className="errors">{imgErr.extension && imgErr.extension}</span>
                    <input value={url2} onChange={e => setUrl2(e.target.value)} type="text" placeholder="Image URL" />
                    <input value={url3} onChange={e => setUrl3(e.target.value)} type="text" placeholder="Image URL" />
                    <input value={url4} onChange={e => setUrl4(e.target.value)} type="text" placeholder="Image URL" />
                    <input value={url5} onChange={e => setUrl5(e.target.value)} type="text" placeholder="Image URL" />
                </div>
                <div className="submitSection">
                    <button>Create Spot</button>
                </div>
            </form>
        </div>
    );
}

export default NewSpot;