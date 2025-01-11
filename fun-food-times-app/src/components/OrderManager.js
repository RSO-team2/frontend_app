import axios from 'axios';
import { Calendar, Check, Clock, MessageSquare, Pizza, Send, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from "react-router-dom";

function OrderManager() {
    const navigate = useNavigate();

    const params = useParams();
    const authUrl = process.env.REACT_APP_LOGIN_ENDPOINT;
    const restaurantUrl = process.env.REACT_APP_RESTURANT_ENDPOINT;
    const reservationUrl = process.env.REACT_APP_RESERVATION_ENDPOINT;
    const orderUrl = process.env.REACT_APP_ORDER_ENDPOINT;

    const [restaurantMenu, setRestaurantMenu] = useState([]);
    const [selectedImages, setSelectedImages] = useState(new Set());

    const [scheduleData, setScheduleData] = useState({
        date: 0,
        time: 0,
        message: '',
        numberOfPeople: 1
    });
    const [deliveryLocation, setDeliveryLocation] = useState("current");
    const [userData, setUserData] = useState(
        {
            "user_email": "",
            "user_address": "",
        }
    );

    const fetchMenuOfRestaurnat = async () => {
        try {
            const response = await fetch(restaurantUrl + '/get_menu_by_id?restaurant_id=' + params.id, {
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

    const getUserLocation = async () => {
        try {
            const resIP = await axios.get("https://api.ipify.org/?format=json");
            return resIP.data.ip;
        } catch (error) { 
            return 0
        }
    };

    const handleCreateNewOrder = async () => {
        try {
            const items = Array.from(selectedImages).map((index) => restaurantMenu[index][0]);
            var subTotal = 0
            items.forEach((item) => {
                subTotal += restaurantMenu.filter((i) => i[0] === item)[0][2];
            });
            console.log(subTotal)
            const userLocation = await getUserLocation();
            const location = (deliveryLocation === "current" && userLocation !== 0) ? { "parse": true, "value": await getUserLocation() } : { "parse": false, "value": userData.user_address };

            const response = await fetch(orderUrl + '/new_order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "customer_id": Number(localStorage.getItem('user')),
                    "restaurant_id": Number(params.id),
                    "items": items,
                    "total_amount": Number(subTotal),
                    "delivery_address": location,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to submit order');
            }
            
            navigate('/home');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleReservationSubmit = async (e) => {
        e.preventDefault();
        if (!scheduleData.date || !scheduleData.time || !scheduleData.numberOfPeople) {
            return;
        }
        try {
            const response = await fetch(reservationUrl + '/make_reservation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        "customer_id": localStorage.getItem('user'),
                        "restaurant_id": params.id,
                        "make_date": new Date().toUTCString(),
                        "reservation_date": scheduleData.date + ' ' + scheduleData.time,
                        "num_persons": scheduleData.numberOfPeople,
                        "optional_message": scheduleData.message,
                    }
                ),
            });

            if (!response.ok) {
                throw new Error('Failed to schedule');
            }

            setScheduleData({
                date: 0,
                time: 0,
                message: '',
                numberOfPeople: 1
            });
            setSelectedImages(new Set());
            navigate('/home');
        } catch (error) {
            console.error('Error scheduling:', error);
        }
    };

    useEffect(() => {
        const getMenuItems = async () => {
            const response = await fetchMenuOfRestaurnat();
            setRestaurantMenu(response.data.menu_items);
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
            setUserData(
                {
                    "user_email": data.user_email,
                    "user_address": data.adress,
                }
            );
        }
        getUserInfo();
        getMenuItems();
    }, []);

    const toggleImage = (id) => {
        const newSelected = new Set(selectedImages);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedImages(newSelected);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
            <div className="w-full mb-2">
                <Link to="/home">
                    <div className="absolute top-8 left-8">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Pizza size={32} />
                            <span className="text-xl font-semibold">Fun Food Times</span>
                        </div>
                    </div>
                </Link>
            </div>
            <div className="rounded-2xl shadow-xl p-8 mx-32 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/95 flex flex-col justify-between backdrop-blur-sm rounded-xl shadow-xl p-6">
                    <div className="text-left space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select what you wish to Order</h1>
                        <p className="text-gray-600 mb-8">Choose from the items on the menu below, then proceed to finalize your order</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-4">
                        {restaurantMenu.map((menuItem) => (
                            <div
                                key={restaurantMenu.indexOf(menuItem)}
                                className="group relative cursor-pointer"
                                onClick={() => toggleImage(restaurantMenu.indexOf(menuItem))}
                            >
                                <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                                    <img
                                        src={menuItem[3]}
                                        alt={menuItem[1]}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {selectedImages.has(restaurantMenu.indexOf(menuItem)) && (
                                        <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                                            <Check className="text-white w-12 h-12 drop-shadow-lg" />
                                        </div>
                                    )}
                                </div>
                                <div className="mt-4">
                                    <h3 className="text-lg font-semibold text-gray-900">{menuItem[1]}</h3>
                                    <p className="text-gray-600">{menuItem[2]} €</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="user_type" className="block text-sm font-medium text-gray-700">
                            Where to deliver the order?
                        </label>
                        <select
                            id="user_type"
                            name="user_type"
                            value={deliveryLocation}
                            onChange={(e) => setDeliveryLocation(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                            required
                        >
                            <option value="current">Use my current Location</option>
                            <option value="account">Use my accounts address</option>
                        </select>
                    </div>
                    <div className='mt-2 flex justify-end space-x-4'>
                        <div className="mt-8 flex justify-end">
                            <button
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                                onClick={() => setSelectedImages(new Set())}
                            >
                                Clear selected
                            </button>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                                onClick={handleCreateNewOrder}
                            >
                                Proceed with selected ({selectedImages.size})
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white/95 flex flex-col justify-between backdrop-blur-sm rounded-xl shadow-xl p-6">
                    <div className="text-left space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservation Options</h1>
                        <p className="text-gray-600 mb-8">Enter the reservation details below</p>
                    </div>
                    <form onSubmit={handleReservationSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date Picker */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Calendar size={18} />
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={scheduleData.date}
                                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    required
                                />
                            </div>

                            {/* Time Picker */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock size={18} />
                                    Time
                                </label>
                                <input
                                    type="time"
                                    value={scheduleData.time}
                                    onChange={(e) => setScheduleData({ ...scheduleData, time: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    required
                                />
                            </div>
                        </div>

                        {/* Number of People */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Users size={18} />
                                Number of People
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={scheduleData.numberOfPeople}
                                onChange={(e) => setScheduleData({ ...scheduleData, numberOfPeople: parseInt(e.target.value) })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                required
                            />
                        </div>

                        {/* Message Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <MessageSquare size={18} />
                                Message (Optional)
                            </label>
                            <textarea
                                value={scheduleData.message}
                                onChange={(e) => setScheduleData({ ...scheduleData, message: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                rows={4}
                                placeholder="Add any additional notes or messages here..."
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 group"
                            >
                                <Send size={20} className="transition-transform group-hover:translate-x-1" />
                                Schedule Now
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    )
}

export default OrderManager;