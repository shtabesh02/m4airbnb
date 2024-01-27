import { NavLink, useNavigate } from 'react-router-dom';
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
  return (
    <ul className='navBar'>
      <NavLink to="/">
        <img className='logo' src="/logo.png" alt="Home" />
      </NavLink>
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
