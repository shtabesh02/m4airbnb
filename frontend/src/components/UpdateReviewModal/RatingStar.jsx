import { useEffect, useState } from "react";


const RatingStars = ({ rating, onChange }) => {


 const [selectedStars, setSelectedStars] = useState(rating)


 useEffect (() => {
   setSelectedStars(rating)
 }, [rating])


 return (
   <div>
     <div className="selectingStars">
       <div className={selectedStars > 0 ? `starred` : `notStarred`}
           onMouseEnter={() => setSelectedStars(1)}
           onMouseLeave={() => setSelectedStars(rating)}
           onClick={() => onChange(1)}
       >
         <i className="fa-solid fa-star"></i>
       </div>
       <div className={selectedStars > 1 ? `starred` : `notStarred`}
             onMouseEnter={() => setSelectedStars(2)}
             onMouseLeave={() => setSelectedStars(rating)}
             onClick={() => onChange(2)}
       >
         <i className="fa-solid fa-star"></i>
       </div>
       <div className={selectedStars > 2 ? `starred` : `notStarred`}
             onMouseEnter={() => setSelectedStars(3)}
             onMouseLeave={() => setSelectedStars(rating)}
             onClick={() => onChange(3)}
       >
         <i className="fa-solid fa-star"></i>
       </div>
       <div className={selectedStars > 3 ? `starred` : `notStarred`}
             onMouseEnter={() => setSelectedStars(4)}
             onMouseLeave={() => setSelectedStars(rating)}
             onClick={() => onChange(4)}
       >
         <i className="fa-solid fa-star"></i>
       </div>
       <div className={selectedStars > 4 ? `starred` : `notStarred`}
           onMouseEnter={() => setSelectedStars(5)}
           onMouseLeave={() => setSelectedStars(rating)}
           onClick={() => onChange(5)}
       >
         <i className="fa-solid fa-star"></i>
       </div>


       <label htmlFor="rating">Stars</label>


     </div>
   </div>


 );
};


export default RatingStars;