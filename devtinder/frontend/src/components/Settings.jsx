import React from 'react'
import { Link } from 'react-router'
function Settings() {
  return (
    <div className="min-h-screen flex justify-center items-start pt-20 bg-base-100">
      <div className="w-full max-w-md">
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Settings</h2>

            <div className="divider"></div>

            <button className="btn btn-outline btn-primary w-full">
              <Link to="/edit-profile">  Edit Profile</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
