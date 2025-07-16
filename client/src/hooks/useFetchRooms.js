
import { useState, useEffect } from 'react';

const useFetchRooms = () => {
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

  return { joinedRooms, createdRooms, loading, isLoggedIn };
};

export default useFetchRooms;
