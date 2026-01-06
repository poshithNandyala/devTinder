import React from 'react';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../utils/constants';
import { Link } from 'react-router';

function Profile() {
  const user = useSelector(state => state.user);
  if (!user) return <h1 className="text-2xl text-2xl-red-500 text-center">Please <Link to="/login">login</Link> to view your profile</h1>
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {user.photoUrl && <img src={user.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />}
        <h2 className="card-title">{user.name}</h2>

        <p><span className="font-bold">Email:</span> {user.email}</p>
        <p><span className="font-bold">Gender:</span> {user.gender}</p>
        <p><span className="font-bold">Age:</span> {user.age}</p>
        {user.about && <p><span className="font-bold">About:</span> {user.about}</p>}
        {user.skills && user.skills.length > 0 && (
          <p><span className="font-bold">Skills:</span> {Array.isArray(user.skills) ? user.skills.join(', ') : user.skills}</p>
        )}
        {user.college && <p><span className="font-bold">College:</span> {user.college}</p>}
        {user.company && <p><span className="font-bold">Company:</span> {user.company}</p>}
        {user.githubId && (
          <p><span className="font-bold">GitHub:</span> <a href={`https://github.com/${user.githubId}`} target="_blank" rel="noopener noreferrer" className="link">{user.githubId}</a></p>
        )}
        {user.linkedinId && (
          <p><span className="font-bold">LinkedIn:</span> <a href={`https://linkedin.com/in/${user.linkedinId}`} target="_blank" rel="noopener noreferrer" className="link">{user.linkedinId}</a></p>
        )}
      </div>
    </div>
  );
}

export default Profile;
