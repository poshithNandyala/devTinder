import React, { useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { BASE_URL } from "../utils/constants";
import { removeFeed } from "../utils/slices/feedSlice";

function FeedCard({ user }) {
  const dispatch = useDispatch();

  const { _id, name, age, gender, photo } = user || {};

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
      {photo && (
        <figure className="border-b border-base-300">
          <img
            src={photo}
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
