import React from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../config/constants';
import { Link } from 'react-router';

function Profile() {
  const user = useSelector(state => state.user);
  if (!user) return <h1 className="text-2xl text-2xl-red-500 text-center">Please <Link to="/login">login</Link> to view your profile</h1>
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{user.name}</h2>

        <p><span className="font-bold">Email:</span> {user.email}</p>
        <p><span className="font-bold">Gender:</span> {user.gender}</p>
        <p><span className="font-bold">Age:</span> {user.age}</p>
      </div>
    </div>
  );
}

export default Profile;
