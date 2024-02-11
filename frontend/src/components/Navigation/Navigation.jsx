import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';


function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);
  // console.log('sessionUser: ', sessionUser);

  const navigate = useNavigate()

  const handleCreateNewSpotForm = () => {
    navigate(`/spots/newSpot`)
  }
  const goToHome = () => {
    navigate('/')
  }
  return (
    <ul className='navBar'>
      {/* <NavLink to="/"> */}
      {/* <img className='logo' src="/logo.png" alt="Home" /> */}
      <div className="skybnb-logo" onClick={goToHome}>
        <i className="fa-solid fa-ranking-star fa-3x"></i>

        {/* <i class="fa-solid fa-cloud-arrow-up fa-2x"></i> */}
        {/* <i class="fa-solid fa-house fa-2x"></i> */}

        {/* <i class="fa-brands fa-airbnb fa-2x"></i> */}

        <b>skybnb</b>
      </div>

      {/* <div className="search-spot">
        <div className="where">
          <label htmlFor="where">Where</label>
          <input type="text" id='where' placeholder='Search destinations' />
        </div>
        <div className="check-in">
          <label htmlFor="check-in">Check-in</label>
          <input type="date" placeholder='Add dates' id='cehck-in' />
        </div>
        <div className="check-out">
          <label htmlFor="check-out">Check out</label>
          <input type="date" placeholder='check-out' />
        </div>
        <div className="who">
          <label htmlFor="who">Who</label>
          <span className="searchWho">
            <input type="text" placeholder='Add guests'/>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>
      </div> */}
      {/* </NavLink> */}
      <div className='toggle-container'>
        {sessionUser && (
          <button className='navBar-create-new-button' onClick={handleCreateNewSpotForm}>
            Create a New Spot
          </button>
        )}
        {isLoaded && (
          <li className="toggle" >
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </div>

    </ul>
  );
}

export default Navigation;
