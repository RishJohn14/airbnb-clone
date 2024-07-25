import { useContext, useState } from "react"
import { UserContext } from "../UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AccountPage(){
    const {ready,user,setUser} = useContext(UserContext);
    const [redirect, setRedirect] = useState(null);

    let {subpage} = useParams(); 
    if (subpage === undefined)
        subpage = 'profile';  

    async function logout(){
        await axios.post('/logout');
        setUser(null);
        setRedirect('/');
        <Navigate to='/' />
    }

    function linkClasses(type=null){
        let classes = 'py-2 px-6';
        if(type===subpage)
        {
            classes += ' bg-primary text-white rounded-full'
        }
        return classes
    }
    if(redirect){
        return <Navigate to='/' />
    }
    if(ready && !user)
    {
        return <Navigate to='/login' />
    }

    
    return(
        <div>
            <nav className="w-full flex mt-8 gap-2 mb-8 justify-center">
            <Link to='/account/' className={linkClasses('profile')}>My Profile</Link>
            <Link to='/account/bookings' className={linkClasses('bookings')}>My Bookings</Link>
            <Link to='/account/places'className={linkClasses('places')}>My Accomodations</Link> 
            </nav>

            {subpage==='profile' && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email}) <br/>
                    <button className="primary max-w-sm mt-2" onClick={logout}> Logout </button>
                </div>
            )}
        </div>
    );
}