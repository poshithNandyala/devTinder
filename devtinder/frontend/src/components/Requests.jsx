import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setRequest, removeRequest } from '../utils/slices/requestSlice';

function Requests() {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.request);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/connection/getallrequests`,
          { withCredentials: true }
        );
        dispatch(setRequest(res.data));
      } catch (error) {
        toast.error('Failed to load requests');
        console.error(error);
      }
    };

    fetchRequests();
  }, [dispatch]);

  const handleAction = async (requestId, status) => {
    try {
      await axios.patch(
        `${BASE_URL}/connection/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );

      toast.success(`Request ${status}`);
      dispatch(removeRequest(requestId)); 
    } catch (error) {
      toast.error('Action failed');
      console.error(error);
    }
  };

  if (!requests || requests.length === 0) {
    return <div className="text-center mt-10">No requests found</div>;
  }

  return (
    <div className="flex flex-col items-center gap-4 mt-6">
      {requests.map((req) => (
        <div
          key={req._id}
          className="card w-96 bg-base-100 card-sm border border-base-300 shadow-sm"
        >
          <div className="card-body">
            <h2 className="card-title text-base">
              {req.fromId.name}
            </h2>
            <p className="text-sm text-gray-500">
              Age • {req.fromId.age}
            </p>

            <div className="card-actions justify-between mt-4">
              <button
                className="btn btn-outline btn-error btn-sm"
                onClick={() => handleAction(req._id, 'rejected')}
              >
                Reject
              </button>

              <button
                className="btn btn-success btn-sm"
                onClick={() => handleAction(req._id, 'accepted')}
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Requests;
