import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import Perks from "../Perks";
import axios from "axios";

export default function PlacesPage() {
    const {action} = useParams();

    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [photoLink, setPhotoLink] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState([]);
    const [extraInfo, setExtraInfo]  = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(0);

    function inputHeader(text)
    {
        return (
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }  

    function inputP(text){
        return(
            <p className="text-sm text-gray-500">{text}</p>
        );
    }

    function inputInfo(header, desc){
        return(
            <>
            {inputHeader(header)}
            {inputP(desc)}
            </>
        );
    }
 
    async function addPhotoByLink(ev)
    {
        ev.preventDefault();
        const {data:fileName} = await axios.post('/upload-by-link', {link: photoLink});
        setAddedPhotos(prev => {
            return[...prev, fileName];
        });
        setPhotoLink('');
    }

    function uploadPhoto(ev){
        //ev.preventDefault();
        const files = ev.target.files;
        const data = new FormData();
        for(let i=0;i<files.length;i++)
        {
            data.append('photos',files[i]);
        }
        axios.post('/upload', data, {
            headers: {'Content-type':'multipart/form-data'}
        }).then(response => {
            const {data:fileNames} = response;
            setAddedPhotos(prev => {
                return[...prev, ...fileNames];
            });
        })
        console.log({files});

    }

    async function addNewPlace(ev){
        ev.preventDefault();
        const placeData = {title,address,addedPhotos,description,perks,extraInfo,checkIn,checkOut,maxGuests
        };
        await axios.post('/places',placeData);
        //Figure out redirect
    }

    return(
        <div>
            {action!==  'new' && (
            <div className="text-center">
                <Link className="inline-flex gap-1 bg-primary py-2 px-6 rounded-full text-white" to={'/account/places/new'}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>

                Add new Place</Link>
            </div>
            )}
            {action ==='new' && (
                <div>
                    <form onSubmit={addNewPlace}>
                        {inputInfo('Title','Title/Name of your accomodation')}
                        <input type="text" placeholder="Title" value={title} onChange={ev => setTitle(ev.target.value)} />

                        {inputInfo('Address','Address of your accomodation')}
                        <input type="text" placeholder="Address" value={address} onChange={ev => setAddress(ev.target.value)} />

                        {inputInfo('Photos','The more the better')}
                        <div className="flex gap-2">
                            <input type="text" placeholder="Add using link" value={photoLink} onChange={ev => setPhotoLink(ev.target.value)}/>
                            <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add Photo</button>
                        </div>
                        <div className="grid gap-3 grid-cols-3 md: grid-cols-4 lg:grid-cols-5 mt-2">
                        {addedPhotos.length > 0 && addedPhotos.map(link => (
                            <div className="h-46 flex" key={link}>
                                <img src={'http://localhost:4000/uploads/'+link} className=" w-full object-cover position-center rounded-2xl"/>
                            </div>
                        ))}
                        <label className="flex h-46 gap-3 cursor-pointer items-center border bg-transparent rounded-2xl p-2 text-gray-600 text-2xl justify-center">
                        <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                        </svg>
                          Upload
                        </label>
                        </div>

                        {inputInfo('Description','Description of your accomodation')}
                        <textarea value={description} onChange={ev => setDescription(ev.target.value)}/>

                        {inputInfo('Perks','Select all perks your accomodation offers')}
                        <div className=" gap-2  mt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                            <Perks selected={perks} onChange={setPerks}/>
                        </div>

                        {inputInfo('Extra Info','House Rules')}
                        <textarea value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/>

                        {inputInfo('Check In/Out Times','Do maintain a window between guests for housekeeping')}
                        <div className="grid grid-cols-3 gap-3 mt-4">
                            <div className="mt-2 -mb-1">
                                <h3>Check-In</h3>
                                <input type="text" placeholder="14:00hrs" value={checkIn} onChange={ev => setCheckIn(ev.target.value)} />
                            </div>
                            <div className="mt-2 -mb-1">
                                <h3>Check-Out</h3>
                                <input type="text" placeholder="11:00hrs" value={checkOut} onChange={ev => setCheckOut(ev.target.value)} />
                            </div>
                            <div className="mt-2 -mb-1">
                                <h3>Max Guests</h3>
                                <input type="number" placeholder="4 guests" value={maxGuests} onChange={ev => setMaxGuests(ev.target.value)}/>
                            </div>
                        </div>
                        <div className="flex mt-5 items-center justify-center">
                        <button className="primary my-4 max-w-md mx-auto">Save</button>
                        </div>
                        

                    </form>
                </div>
            )}
        </div>
    );
}