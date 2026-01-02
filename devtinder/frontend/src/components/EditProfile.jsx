import axios from 'axios'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { BASE_URL } from '../utils/constants'
import { login } from '../utils/slices/userSlice'

function EditProfile() {
  const user = useSelector(state => state.user)
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: user.name,
    gender: user.gender,
    age: user.age
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    const age = Number(formData.age)

    if (age < 18) {
      toast.error('Age must be at least 18')
      return
    }

    if (age > 100) {
      toast.error('Age must be at most 100')
      return
    }

    try {
      const user = await axios.patch(BASE_URL + "/user/update", formData, { withCredentials: true })
      toast.success('Profile updated successfully');
      dispatch(login(user.data));
      console.log('Profile Updated:', user.data)
    } catch (error) {
      toast.error('Error updating profile' +error?.response?.data || "something went wrong");
  
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-start pt-20 bg-base-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">

        {/* FORM */}
        <form onSubmit={handleSubmit} className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Edit Profile</h2>

            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              className="input input-bordered"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label className="label">Gender</label>
            <select
              name="gender"
              className="select select-bordered"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>

            <label className="label">Age</label>
            <input
              type="number"
              name="age"
              className="input input-bordered"
              value={formData.age}
              onChange={handleChange}
            />

            <button type="submit" className="btn btn-primary mt-4">
              Save Changes
            </button>
          </div>
        </form>

        {/* LIVE PREVIEW CARD */}
        <div className="card bg-base-200 shadow-md">
          <div className="card-body">
            <h2 className="card-title">Profile Preview</h2>

            <p><strong>Name:</strong> {formData.name || '—'}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Age:</strong> {formData.age || '—'}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default EditProfile
