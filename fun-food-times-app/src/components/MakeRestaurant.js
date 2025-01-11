import { Check, Pizza, Plus, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

function MakeRestaurant() {
    const navigate = useNavigate();

    const restaurantUrl = process.env.REACT_APP_RESTURANT_ENDPOINT;
    const [formData, setFormData] = useState({
        name: '',
        type: '',
        rating: 0,
        address: '',
        average_time: 30,
        price_range: 1,
        user_id: localStorage.getItem('user'),
    })
    const [loading, setLoading] = useState(false)
    const [firstStep, setFirstStep] = useState(true)
    const [error, setError] = useState(null)
    const [restaurantId, setRestaurantId] = useState(null)
    const [menuItems, setMenuItems] = useState([]);
    const [selectedImages, setSelectedImages] = useState(new Set());
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [newMenuItem, setNewMenuItem] = useState({
        name: '',
        price: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(restaurantUrl + '/get_menu_items', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch menu items');
            }

            const data = await response.json();
            return { data };
        } catch (error) {
            return {
                data: [],
                error: 'Failed to load menu items. Please try again later.' + error,
            };
        }
    }

    const addMenuItem = async () => {
        try {
            const response = await fetch(restaurantUrl + '/add_menu_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newMenuItem),
            });
            if (!response.ok) {
                throw new Error('Failed to add menu item');
            }
            const data = await response.json();
            setMenuItems(prev => [...prev, data.menu_item]);
            setNewMenuItem({ name: '', price: '' });
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        const getMenuItems = async () => {
            const response = await fetchMenuItems();
            setMenuItems(response.data.menu_items);
        }
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

    const handleAddMenuItem = () => {
        if (newMenuItem.price && newMenuItem.name) {
            addMenuItem();
            setIsPopupOpen(false);
        }
    };

    const handleSubmitAddRestaurant = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(restaurantUrl + '/add_restaurant', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Registration failed')
            } else {
                setRestaurantId(data.restaurant_id)
                setFirstStep(false)
                setError(null)
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during registration')
        } finally {
            setLoading(false)
        }
    }

    const handleAddMenuToRestaurant = async () => {
        try {
            const items = Array.from(selectedImages).map((index) => menuItems[index][0]);
            const response = await fetch(restaurantUrl + '/add_menu', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    restaurant_id: restaurantId,
                    items: items,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add menu items to restaurant');
            }

            navigate('/home');
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col justify-center">
            <div className="w-full max-w-md">
                <Link to="/">
                    <div className="absolute top-8 left-8">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Pizza size={32} />
                            <span className="text-xl font-semibold">Fun Food Times</span>
                        </div>
                    </div>
                </Link>
            </div>
            {firstStep ? (
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 mx-32">
                    <div className="text-center space-y-2">
                        <h1 className="text-2xl font-bold text-gray-900">Create a restaurant</h1>
                        <p className="text-blue-600">Please fill in the details below to add your restaurnat to the application</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmitAddRestaurant} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Resturant Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Enter the name of your restaurant"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                Restaurant Type (Type of Cuisine)
                            </label>
                            <input
                                id="type"
                                name="type"
                                type="text"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Enter the type of cuisine your restaurant serves (e.g., Italian, Mexican, etc.)"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="average_time" className="block text-sm font-medium text-gray-700">
                                Customer Rating on Respected Platforms
                            </label>
                            <input
                                id="rating"
                                name="rating"
                                type="number"
                                value={formData.rating}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                required
                                step={0.1}
                                min={0}
                                max={5}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                                Address
                            </label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                placeholder="Enter the address of your restaurant"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="average_time" className="block text-sm font-medium text-gray-700">
                                Average Waiting Time
                            </label>
                            <input
                                id="average_time"
                                name="average_time"
                                type="number"
                                value={formData.average_time}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                required
                                step={5}
                                min={5}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price_range" className="block text-sm font-medium text-gray-700">
                                Select the Price Range (1-5)
                            </label>
                            <input
                                id="price_range"
                                name="price_range"
                                type="number"
                                value={formData.price_range}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-colors"
                                required
                                min={1}
                                max={5}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 font-medium hover:bg-blue-500 focus:ring-4 focus:ring-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Adding restaurant...' : 'Add restaurant to database'}
                        </button>
                    </form>
                </div>) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6 mx-32 my-32">
                    <div className="relative z-10 container mx-auto px-4 overflow-auto">
                        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-2">
                            <div className="flex justify-between items-center mb-8">
                                <div className="text-left space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Relevant Menu Items</h1>
                                    <p className="text-gray-600 mb-8">Choose the menu items, which you serve in your restaurant from the collection below or add your own</p>
                                </div>
                                <button
                                    onClick={() => setIsPopupOpen(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                                >
                                    <Plus size={20} />
                                    Add New Menu Item
                                </button>
                            </div>
                            <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-6">
                                {menuItems.map((menuItem) => (
                                    <div
                                        key={menuItems.indexOf(menuItem)}
                                        className="group relative cursor-pointer"
                                        onClick={() => toggleImage(menuItems.indexOf(menuItem))}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                                            <img
                                                src={menuItem[3]}
                                                alt={menuItem[1]}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            {selectedImages.has(menuItems.indexOf(menuItem)) && (
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
                                        onClick={handleAddMenuToRestaurant}
                                    >
                                        Configure selected ({selectedImages.size})
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Add New Menu Item</h2>
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                            </label>
                            <input
                                type="text"
                                value={newMenuItem.name}
                                onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Menu Item Name"
                            />
                        </div>

                        <div className='mt-4'>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Price
                            </label>
                            <input
                                type='number'
                                value={newMenuItem.price}
                                onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Menu Item Price"
                            />
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsPopupOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddMenuItem}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                                Add Menu Item
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MakeRestaurant