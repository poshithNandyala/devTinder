import React from "react";

function FeedCard({ user }) {
  const { name, age, gender, photo } = user;

  return (
    <div className="
      card bg-base-100 w-96
      border border-base-300
      shadow-sm
      hover:shadow-md transition
    ">

      {/* Image (only if real photo exists) */}
      {photo && (
        <figure className="border-b border-base-300">
          <img
            src={photo}
            alt={name}
            className="h-64 w-full object-cover"
          />
        </figure>
      )}

      <div className="card-body">

        {/* Name */}
        <h2 className="card-title text-xl">
          {name}
        </h2>

        {/* Meta */}
        <p className="text-sm text-gray-500 capitalize">
          {gender} • {age} years
        </p>

        {/* Actions */}
        <div className="card-actions justify-between mt-4">
          <button className="btn btn-outline">
            Ignore
          </button>

          <button className="btn btn-primary">
            Interest
          </button>
        </div>

      </div>
    </div>
  );
}

export default FeedCard;
