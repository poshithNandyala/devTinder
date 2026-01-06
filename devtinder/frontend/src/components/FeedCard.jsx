import React, { useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { BASE_URL } from "../utils/constants";
import { removeFeed } from "../utils/slices/feedSlice";

function FeedCard({ user }) {
  const dispatch = useDispatch();

  const { _id, name, age, gender, photoUrl, about, skills, college, company, githubId, linkedinId } = user || {};

  const handleStatus = useCallback(
    async (status) => {
      if (!_id) return;

      try {
        const res = await axios.post(
          `${BASE_URL}/connection/send/${status}/${_id}`,
          {},
          { withCredentials: true }
        );

        dispatch(removeFeed(_id));
        toast.success(res.data);
      } catch (error) {
        console.error(error);
        toast.error(
          error?.response?.data || "Something went wrong. Try again."
        );
      }
    },
    [_id, dispatch]
  );

  return (
    <div
      className="
        card bg-base-100 w-96
        border border-base-300
        shadow-sm
        hover:shadow-md transition
      "
    >
      {/* Image */}
      {photoUrl && (
        <figure className="border-b border-base-300">
          <img
            src={photoUrl}
            alt={`${name}'s profile`}
            className="h-64 w-full object-cover"
            loading="lazy"
          />
        </figure>
      )}

      <div className="card-body">
        {/* Name */}
        <h2 className="card-title text-xl">{name}</h2>

        {/* Meta */}
        <p className="text-sm text-gray-500 capitalize">
          {gender} • {age} years
        </p>

        {/* About */}
        {about && <p className="text-sm">{about}</p>}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.map((skill, idx) => (
              <span key={idx} className="badge badge-outline badge-sm">{skill}</span>
            ))}
          </div>
        )}

        {/* College & Company */}
        {college && <p className="text-xs text-gray-500">🎓 {college}</p>}
        {company && <p className="text-xs text-gray-500">🏢 {company}</p>}

        {/* Social Links */}
        <div className="flex gap-2">
          {githubId && (
            <a href={`https://github.com/${githubId}`} target="_blank" rel="noopener noreferrer" className="link link-primary text-xs">GitHub</a>
          )}
          {linkedinId && (
            <a href={`https://linkedin.com/in/${linkedinId}`} target="_blank" rel="noopener noreferrer" className="link link-primary text-xs">LinkedIn</a>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions justify-between mt-4">
          <button
            onClick={() => handleStatus("ignored")}
            className="btn btn-outline"
          >
            Ignore
          </button>

          <button
            onClick={() => handleStatus("request")}
            className="btn btn-primary"
          >
            Interest
          </button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(FeedCard);
