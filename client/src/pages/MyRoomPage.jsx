import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import JoinedRooms from '../components/myRoom/JoinedRooms';
import CreatedRooms from '../components/myRoom/CreatedRooms';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

const MyRoomPage = () => {
  const [activeTab, setActiveTab] = useState('joined');
  const [searchQuery, setSearchQuery] = useState('');
  const [joinedRooms, setJoinedRooms] = useState([]);
  const [createdRooms, setCreatedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/getMyRooms`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        
        if (response.status === 401) {
          setIsLoggedIn(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success) {
          setJoinedRooms(data.joinedRooms || []);
          setCreatedRooms(data.createdRooms || []);
        } else {
          console.error('API returned an error:', data.message);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading rooms...</p>
        </div>
      );
    }

    if (!isLoggedIn) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-300 text-lg mb-4">Please login to view your rooms</p>
          <Link 
            to="/auth" 
            className="inline-block px-6 py-2 bg-[#bbb8ff] text-[#232329] rounded-full hover:bg-[#aaaaff] transition-colors duration-200 decoration-transparent"
          >
            Login Now
          </Link>
        </div>
      );
    }

    return (
      <>
        {activeTab === 'joined' ? (
          <JoinedRooms rooms={joinedRooms} searchQuery={searchQuery} />
        ) : (
          <CreatedRooms rooms={createdRooms} searchQuery={searchQuery} />
        )}
      </>
    );
  };

  return (
    <>
    <Navbar />
    <div className="min-h-[calc(100vh-3.5rem)] flex flex-col bg-[#232329]">
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search rooms..."
            className="w-full max-w-2xl mx-auto block p-3 border border-[#bbb8ff] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#bbb8ff] bg-[#2A2A30] text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex justify-center mb-8 border-b border-[#393E46]">
          <button
            className={`py-3 px-8 ${
              activeTab === 'joined'
                ? 'border-b-2 border-[#bbb8ff] text-[#bbb8ff]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('joined')}
          >
            Joined Rooms
          </button>
          <button
            className={`py-3 px-8 ${
              activeTab === 'created'
                ? 'border-b-2 border-[#bbb8ff] text-[#bbb8ff]'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('created')}
          >
            Created Rooms
          </button>
        </div>

        {renderContent()}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default MyRoomPage; 