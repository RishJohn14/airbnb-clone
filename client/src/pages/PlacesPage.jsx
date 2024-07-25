import { Link, useParams } from "react-router-dom";

export default function PlacesPage() {
    const {action} = useParams();

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
                    <form>
                        <h2 className="text-2xl mt-4">Title</h2>
                        <p className="text-sm text-gray-500">Title/Name of your accomodation</p>
                        <input type="text" placeholder="Title" />

                        <h2 className="text-2xl mt-4">Address</h2>
                        <p className="text-sm text-gray-500">Address of your accomodation</p>
                        <input type="text" placeholder="Address" />

                        <h2 className="text-2xl mt-4">Photos</h2>
                        <p className="text-sm text-gray-500">The more the better</p>
                        <div className="grid grid-cols-3 md: grid-cols-4 lg:grid-cols-5 mt-2">
                        <button className="border bg-transparent rounded-2xl p-8 text-gray-600">+</button>
                        </div>

                        <h2 className="text-xl mt-4">Title</h2>
                        <p className="text-sm text-gray-500">Title/Name of your accomodation</p>
                        <input type="text" placeholder="Title" />

                        <h2 className="text-xl mt-4">Title</h2>
                        <p className="text-sm text-gray-500">Title/Name of your accomodation</p>
                        <input type="text" placeholder="Title" />

                    </form>
                </div>
            )}
        </div>
    );
}