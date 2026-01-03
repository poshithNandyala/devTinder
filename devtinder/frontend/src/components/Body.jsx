import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { login } from "../utils/slices/userSlice";
import { ToastContainer, toast } from "react-toastify";

function Body() {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          BASE_URL + "/user/profile",
          { withCredentials: true }
        );
        dispatch(login(res.data));
      } catch (error) {
        if (error?.response?.status === 401) {
          toast.dismiss()
          toast.error("Please Login First")
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, dispatch, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-xl animate-spin fast"></span>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <ToastContainer />
    </>
  );
}

export default Body;
