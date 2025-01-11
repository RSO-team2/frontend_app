import { Clock, MapPin, Pizza, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    const authUrl = process.env.REACT_APP_LOGIN_ENDPOINT;
    const restaurantUrl = process.env.REACT_APP_RESTURANT_ENDPOINT;
    const reservationUrl = process.env.REACT_APP_RESERVATION_ENDPOINT;
    const orderUrl = process.env.REACT_APP_ORDER_ENDPOINT;

    const [restaurants, setRestaurants] = useState([]);
    const [userType, setUserType] = useState(0);

    const [restaurantReservations, setRestaurantReservations] = useState([]);
    const [restaurantOrders, setRestaurantOrders] = useState([]);
    const [restaurantId, setRestaurantId] = useState(0);

    const fetchRestaurants = async () => {
        try {
            const response = await fetch(restaurantUrl + '/get_restaurants', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            return {
                data: [],
                error: 'Failed to load restaurants. Please try again later.' + error,
            };
        }
    }

    const fetchRestaurantReservations = async () => {
        try {
            const response = await fetch(reservationUrl + '/get_reservations_by_restaurant?restaurant_id=' + restaurantId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            return {
                data: [],
                error: 'Failed to load restaurants. Please try again later.' + error,
            };
        }
    }

    const fetchRestaurantOrders = async () => {
        try {
            const response = await fetch(orderUrl + '/get_restaurant_orders?restaurant_id=' + restaurantId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch restaurants');
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            return {
                data: [],
                error: 'Failed to load restaurants. Please try again later.' + error,
            };
        }
    }

    useEffect(() => {
        const getResturants = async () => {
            const response = await fetchRestaurants();
            setRestaurants(response.data.resturant_list);
        }
        const getReservations = async () => {
            const response = await fetchRestaurantReservations();
            if (response.data.reservations)
                setRestaurantReservations(response.data.reservations.map(reservation => ({
                    ...reservation,
                    date: new Date(reservation.date).toLocaleDateString(),
                    time: new Date(reservation.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                })));
                console.log(restaurantReservations)
        }
        const getOrders = async () => {
            const response = await fetchRestaurantOrders();
            if (response.data.data)
                setRestaurantOrders(response.data.data.map(order => ({
                    ...order,
                    date: new Date(order.date).toLocaleDateString(),
                    time: new Date(order.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                })));
                console.log(restaurantOrders)
        }
        const getUserInfo = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                navigate('/');
            }
            const response = await fetch(authUrl + '/api/getUserInfo?user_id=' + user, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch user info');
            }
            setUserType(data.user_type);
            setRestaurantId(data.restaurant_id);
        }
        getResturants();
        getUserInfo();
        getReservations();
        getOrders();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center">
            <div className="w-full mb-2">
                <Link to="/home">
                    <div className="absolute top-8 left-8">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Pizza size={32} />
                            <span className="text-xl font-semibold">Fun Food Times</span>
                        </div>
                    </div>
                </Link>
                {userType === 3 ? (
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900 mb-8 mt-12 text-center">Available Restaurants</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4">
                            {restaurants.map((restaurant) => (
                                <div key={restaurant[0]} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="relative h-48">
                                        <img
                                            src={restaurant[7]}
                                            alt={restaurant[1]}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg shadow-md">
                                            <span className="flex items-center gap-1">
                                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                {restaurant[3]}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h2 className="text-xl font-semibold text-gray-900">{restaurant[1]}</h2>
                                                <p className="text-gray-600">{restaurant[2]} • {[...Array(restaurant[6])].map((e, i) => <span className="busterCards" key={i}>$</span>)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span className="text-sm">{restaurant[4]}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-sm">{restaurant[5]} min</span>
                                            </div>
                                        </div>

                                        <button
                                            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                            onClick={() => navigate('/manage_order/' + restaurant[0])}
                                        >
                                            Order or make a Reservation Now
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900 mb-8 mt-12 text-center">Restaurant Management</h1>

                        <div className="rounded-2xl shadow-xl p-8 mx-32 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/95 flex flex-col justify-between backdrop-blur-sm rounded-xl shadow-xl p-6">
                                <div className="text-left space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
                                    <p className="text-gray-600 mb-8">Manage the currently active orders</p>
                                </div>
                                <div className="flex">
                                    {restaurantOrders.map((order) => (
                                        <div key={order[0]} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                            
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/95 flex flex-col justify-between backdrop-blur-sm rounded-xl shadow-xl p-6">
                                <div className="text-left space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcomming Reservations</h1>
                                    <p className="text-gray-600 mb-8">View the upcomming reservations made by your customers</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div >
    )
}

export default Home