import React from 'react'
import { Link } from "react-router-dom";
import { Pizza } from 'lucide-react'
function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
            <div className="w-full max-w-md">
                <Link to="/home">
                    <div className="absolute top-8 left-8">
                        <div className="flex items-center gap-2 text-blue-600">
                            <Pizza size={32} />
                            <span className="text-xl font-semibold">Fun Food Times</span>
                        </div>
                    </div>
                </Link>
            </div>
        </div >
    )
}

export default Home