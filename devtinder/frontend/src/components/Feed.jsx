import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../utils/constants';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed } from '../utils/slices/feedSlice';
import FeedCard from './FeedCard';

function Feed() {
  const dispatch = useDispatch();
  const feed = useSelector((state) => state.feed);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/connection/feed`, {
          withCredentials: true,
        });
        dispatch(setFeed(res.data.data));
      } catch (err) {
        console.log(err);
        toast.error('Failed to fetch feed data');
      }
    };

    fetchFeed();
  }, [dispatch]);

  if (!feed || feed.length === 0) {
    return <div className="text-center mt-10">No feed available</div>;
  }

  return (
    <div className="flex justify-center mt-10">
      <FeedCard user={feed[0]} />
    </div>
  );
}

export default Feed;
