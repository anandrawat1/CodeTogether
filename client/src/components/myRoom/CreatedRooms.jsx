import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';

const CreatedRooms = ({ rooms, searchQuery }) => {
  const navigate = useNavigate();

  const filteredRooms = rooms.filter((room) =>
    room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRoom = () => {
    navigate('/room?mode=create');
  };

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <div
        className="flex items-center justify-center h-64 bg-[#2A2A30] border border-[#393E46] rounded-lg cursor-pointer hover:bg-[#2F2F36] transition-colors"
        onClick={handleCreateRoom}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-[#343440] rounded-full flex items-center justify-center mx-auto mb-3">
            <FiPlus className="text-[#00acb5] text-xl" />
          </div>
          <p className="text-xl font-medium text-gray-300">Create Room</p>
        </div>
      </div>

      {filteredRooms.map((room) => (
        <div
          key={room._id}
          className="flex flex-col justify-between h-64 p-6 bg-[#2A2A30] border border-[#393E46] rounded-lg shadow-md hover:shadow-lg hover:border-[#00acb5] transition-all cursor-pointer"
        >
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{room.roomName}</h3>
            <p className="text-sm text-gray-400">
              Created At: {new Date(room.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              {room.users?.length || 0} participant{room.users?.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      ))}

      {filteredRooms.length === 0 && searchQuery && (
        <div className="col-span-full text-center text-gray-400 py-8">
          No created rooms found matching your search.
        </div>
      )}
    </div>
  );
};

export default CreatedRooms;
