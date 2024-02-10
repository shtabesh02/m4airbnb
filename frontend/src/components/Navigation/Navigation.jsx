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

      {/* </NavLink> */}
      <div className='toggle-container'>
        {sessionUser && (
          <button className ='navBar-create-new-button' onClick={handleCreateNewSpotForm}>
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
