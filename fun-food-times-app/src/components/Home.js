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

    const [restaurantId, setRestaurantId] = useState(0);
    const [restaurantReservations, setRestaurantReservations] = useState([]);
    const [restaurantOrders, setRestaurantOrders] = useState([]);
    const [restaurantMenu, setRestaurantMenu] = useState([]);

    const [userOrders, setUserOrders] = useState([]);
    const [userReservations, setUserReservations] = useState([]);

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

    const fetchRestaurantReservations = async (restaurantId) => {
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

    const fetchUserReservations = async (userId) => {
        try {
            const response = await fetch(reservationUrl + '/get_reservations_by_user?customer_id=' + userId, {
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

    const fetchRestaurantOrders = async (restaurantId) => {
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

    const fetchUserOrders = async (userId) => {
        try {
            const response = await fetch(orderUrl + '/get_user_orders?customer_id=' + userId, {
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

    const fetchMenuOfRestaurnat = async (restaurantId) => {
        try {
            const response = await fetch(restaurantUrl + '/get_menu_by_id?restaurant_id=' + restaurantId, {
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

    const getOrdersRestaurant = async (restaurantId) => {
        const response = await fetchRestaurantOrders(restaurantId);
        if (response.data.data) {
            console.log(response.data);
            setRestaurantOrders(response.data.data);
        }
    }

    const updateOrderStatus = async (order_id, status) => {
        try {
            const response = await fetch(orderUrl + '/update_order_status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    order_id: order_id,
                    status: status,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update order status');
            }
            const data = await response.json();
            getOrdersRestaurant(restaurantId);
            return { data };
        } catch (error) {
            return {
                data: [],
                error: 'Failed to update order' + error,
            }
        }
    }

    const getUserInfo = async (id = false) => {
        const user = JSON.parse(id || localStorage.getItem('user'));
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
        return { data };
    }

    useEffect(() => {
        const getResturants = async () => {
            const response = await fetchRestaurants();
            setRestaurants(response.data.resturant_list);
        }
        const getMenuItems = async (restaurantId) => {
            const response = await fetchMenuOfRestaurnat(restaurantId);
            setRestaurantMenu(response.data.menu_items);
        }
        const getRestaurantReservations = async (restaurantId) => {
            const response = await fetchRestaurantReservations(restaurantId);
            if (response.data.reservations) {
                setRestaurantReservations(response.data.reservations);
            }
        }
        const getOrdersUser = async () => {
            const response = await fetchUserOrders(localStorage.getItem('user'));
            if (response.data.data) {
                setUserOrders(response.data.data);
            }
        }
        const getUserReservations = async () => {
            const response = await fetchUserReservations(localStorage.getItem('user'));
            if (response.data.reservations) {
                setUserReservations(response.data.reservations);
            }
        }
        const setUserInfo = async () => {
            const data = await getUserInfo();
            setUserType(data.data.user_type);
            setRestaurantId(data.data.restaurant_id);
            if (data.data.restaurant_id) {
                getRestaurantReservations(data.data.restaurant_id);
                getOrdersRestaurant(data.data.restaurant_id);
                getMenuItems(data.data.restaurant_id);
            }
        }
        getResturants();
        setUserInfo();
        getOrdersUser();
        getUserReservations();
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
                <button
                    className="absolute top-8 right-8 h-14 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors text-center"
                    onClick={() => {
                        localStorage.removeItem('user');
                        navigate('/');
                    }}
                >
                    Logout
                </button>
                {userType === 3 ? (
                    <div className='flex mt-14 justify-center gap-4'>
                        <div>
                            <h1 className="text-3xl font-bold text-blue-900 mb-8 mt-12 text-center">Your Data</h1>
                            <div className="flex flex-col justify-center mt-8 mb-4 gap-4">
                                <div className="bg-white/95 flex flex-col backdrop-blur-sm rounded-xl shadow-xl p-6">
                                    <div className="text-left space-y-2">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        {userOrders.map((order) => (
                                            <div key={order[0]} className="bg-black text-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full">
                                                <div className="grid gap-4 m-4">
                                                    <span>Ordered On: {order[2]}</span> <span> Total Price: {order[3]} €</span>

                                                    {order[6] === 1 ?
                                                        <p
                                                            className='text-white px-6 py-3 bg-red-600 rounded-lg hover:bg-blue-700 transition-colors duration-200'
                                                        >
                                                            Not Yet Processing
                                                        </p>
                                                        : order[6] === 2 ?
                                                            <p
                                                                className='text-white px-6 py-3 bg-orange-600 rounded-lg hover:bg-blue-700 transition-colors duration-200'
                                                            >
                                                                Processing
                                                            </p>
                                                            : order[6] === 3 ?
                                                                <p
                                                                    className='text-white px-6 py-3 bg-green-600 rounded-lg hover:bg-blue-700 transition-colors duration-200'
                                                                >
                                                                    In Delivery
                                                                </p>
                                                                : <p
                                                                    className='text-white px-6 py-3 bg-green-600 rounded-lg hover:bg-blue-700 transition-colors duration-200'
                                                                >
                                                                    Delivered
                                                                </p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white/95 flex flex-col backdrop-blur-sm rounded-xl shadow-xl p-6">
                                    <div className="text-left space-y-2">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcomming Reservations</h1>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        {userReservations.filter(reservation => new Date(reservation.reservation_date) > new Date()).map(reservation => (
                                            <div key={reservation.reservation_id} className="bg-white/95 flex flex-col justify-between backdrop-blur-sm rounded-xl shadow-xl p-2 border-2 border-gray-300">
                                                <div className="grid gap-4 m-4">
                                                    <span> Reservation Date: {reservation.reservation_date}</span>
                                                    <span> Number of People: {reservation.number_guests}</span>
                                                    <span> Reservation Message: {reservation.message}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
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
                    </div>
                ) : (
                    <div>
                        <h1 className="text-3xl font-bold text-blue-900 mb-8 mt-12 text-center">Restaurant Management</h1>

                        <div className="rounded-2xl shadow-xl p-8 mx-32 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/95 flex flex-col backdrop-blur-sm rounded-xl shadow-xl p-6">
                                <div className="text-left space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Active Orders</h1>
                                    <p className="text-gray-600 mb-8">Manage the currently active orders</p>
                                </div>
                                <div className="flex">
                                    {restaurantOrders.filter((order) => order[6] !== 4).map((order) => (
                                        <div key={order[0]} className="bg-black text-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-full">
                                            <div className="grid gap-4 m-4">
                                                <span>Ordered On: {order[2]}</span> <span> Total Price: {order[3]} €</span>
                                                <div className="flex items-center gap-2 max-w-32">
                                                    {order[4].map((item) => (
                                                        <div key={item} className="flex items-center gap-2">
                                                            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                                                                <img
                                                                    src={restaurantMenu.filter((mi) => mi[0] === item)[0][3]}
                                                                    alt={restaurantMenu.filter((mi) => mi[0] === item)[0][1]}
                                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                                />
                                                            </div>
                                                            <span >{restaurantMenu.filter((mi) => mi[0] === item)[0][1]}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {order[6] === 1 ?
                                                    <button
                                                        className='text-white px-6 py-3 bg-red-600 rounded-lg hover:bg-blue-700 transition-colors duration-200'
                                                        onClick={() => updateOrderStatus(order[0], 2)}>
                                                        Start Processing
                                                    </button>
                                                    : order[6] === 2 ?
                                                        <button
                                                            className='text-white px-6 py-3 bg-orange-600 rounded-lg hover:bg-blue-700 transition-colors duration-200'
                                                            onClick={() => updateOrderStatus(order[0], 3)}>
                                                            Make Ready For Pickup
                                                        </button>
                                                        : order[6] === 3 ?
                                                            <button
                                                                className='text-white px-6 py-3 bg-green-600 rounded-lg hover:bg-blue-700 transition-colors duration-200'
                                                                onClick={() => updateOrderStatus(order[0], 4)}>
                                                                Confirm Delivery
                                                            </button>
                                                            : <div></div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/95 flex flex-col justify-between backdrop-blur-sm rounded-xl shadow-xl p-6">
                                <div className="text-left space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcomming Reservations</h1>
                                    <p className="text-gray-600 mb-8">View the upcomming reservations made by your customers</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {restaurantReservations.filter(reservation => new Date(reservation.reservation_date) > new Date()).map(reservation => (
                                        <div key={reservation.reservation_id} className="bg-white/95 flex flex-col justify-between backdrop-blur-sm rounded-xl shadow-xl p-2 border-2 border-gray-300">
                                            <div className="grid gap-4 m-4">
                                                <span> Reservation Date: {reservation.reservation_date}</span>
                                                <span> Number of People: {reservation.number_guests}</span>
                                                <span> Reservation Message: {reservation.message}</span>
                                            </div>
                                        </div>
                                    ))}
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