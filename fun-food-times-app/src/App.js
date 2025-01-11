import React from 'react'
import { Pizza } from 'lucide-react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
import Login from './components/Login'
import Register from './components/Register'
import MakeRestaurant from './components/MakeRestaurant'
import Home from './components/Home'
import OrderManager from './components/OrderManager'

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <Pizza className="h-24 w-24 text-blue-600" />
          <h1 className="text-4xl font-bold text-blue-600">Fun Food Times</h1>
        </div>

        <div className="flex gap-4 space-x-4 items-center justify-around">
          <Link to="/login">
            <button
              className="h-14 px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 transition-colors text-center"
            >
              Login
            </button>
          </Link>
          <Link to="/register">
            <button
              className="h-14 px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center"
            >
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
};

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="register/restaurant" element={<MakeRestaurant />} />
        <Route path="home" element={<Home />} />
        <Route path="manage_order/:id" element={<OrderManager />} />
      </Routes>
    </Router>
  );
}

export default App