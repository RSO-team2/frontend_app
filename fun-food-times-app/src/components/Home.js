import React from 'react'
import { Link } from "react-router-dom";
import { Pizza, Star, Clock, MapPin } from 'lucide-react'

const restaurants = [
    {
        id: 1,
        name: "The Rustic Kitchen",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800",
        rating: 4.5,
        cuisine: "Italian",
        priceRange: "$$",
        location: "Downtown",
        waitTime: "20-30 min"
    },
    {
        id: 2,
        name: "Sushi Master",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800",
        rating: 4.8,
        cuisine: "Japanese",
        priceRange: "$$$",
        location: "West Side",
        waitTime: "15-25 min"
    },
    {
        id: 3,
        name: "Taco Express",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800",
        rating: 4.2,
        cuisine: "Mexican",
        priceRange: "$",
        location: "South End",
        waitTime: "10-15 min"
    },
    {
        id: 4,
        name: "Le Bistro",
        image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800",
        rating: 4.7,
        cuisine: "French",
        priceRange: "$$$",
        location: "North End",
        waitTime: "25-35 min"
    },
    {
        id: 5,
        name: "Spice Garden",
        image: "https://images.unsplash.com/photo-1535850836387-0f9dfce30846?auto=format&fit=crop&q=80&w=800",
        rating: 4.4,
        cuisine: "Indian",
        priceRange: "$$",
        location: "East Side",
        waitTime: "20-30 min"
    },
    {
        id: 6,
        name: "The Grill House",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800",
        rating: 4.6,
        cuisine: "Steakhouse",
        priceRange: "$$$",
        location: "Central",
        waitTime: "30-40 min"
    }
];
function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center">
            <div className="w-full max-w-md">
                <Link to="/home">
                    <div className="absolute top-8 left-8">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Pizza size={32} />
                            <span className="text-xl font-semibold">Fun Food Times</span>
                        </div>
                    </div>
                </Link>

                <h1 className="text-3xl font-bold text-blue-900 mb-8 mt-6 text-center">Available Restaurants</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <div className="relative h-48">
                                <img
                                    src={restaurant.image}
                                    alt={restaurant.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg shadow-md">
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        {restaurant.rating}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900">{restaurant.name}</h2>
                                        <p className="text-gray-600">{restaurant.cuisine} • {restaurant.priceRange}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{restaurant.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm">{restaurant.waitTime}</span>
                                    </div>
                                </div>

                                <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                                    Order Now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div >
    )
}

export default Home