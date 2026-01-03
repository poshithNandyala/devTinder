import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setConnection } from '../utils/slices/connectionSlice';

function Connections() {
  const dispatch = useDispatch();
  const connections = useSelector((state) => state.connection);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/connection/allconnections`,
          { withCredentials: true }
        );
        dispatch(setConnection(res.data));
      } catch (error) {
        toast.error('Something went wrong');
        console.error(error);
      }
    };

    fetchConnections();
  }, [dispatch]);

  if (!connections || connections.length === 0) {
    return <div className="text-center mt-10">No connections found</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {connections.map((user) => (
        <div
          key={user._id}
          className="card w-96 bg-base-100 card-sm border border-base-300 shadow-sm"
        >
          <div className="card-body">
            <h2 className="card-title text-base">
              {user.name}
            </h2>
            <p className="text-sm text-gray-500 capitalize">
              {user.gender} • {user.age}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Connections;
