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
    name: user.name || '',
    gender: user.gender || 'male',
    age: user.age || '',
    about: user.about || '',
    skills: Array.isArray(user.skills) ? user.skills.join(', ') : (user.skills || ''),
    college: user.college || '',
    company: user.company || '',
    githubId: user.githubId || '',
    linkedinId: user.linkedinId || ''
  })
  const [photo, setPhoto] = useState(null)

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
      const data = new FormData()
      data.append('name', formData.name)
      data.append('gender', formData.gender)
      data.append('age', formData.age)
      data.append('about', formData.about)
      data.append('skills', formData.skills)
      data.append('college', formData.college)
      data.append('company', formData.company)
      data.append('githubId', formData.githubId)
      data.append('linkedinId', formData.linkedinId)
      if (photo) data.append('photo', photo)

      const res = await axios.patch(BASE_URL + "/user/update", data, { withCredentials: true })
      toast.success('Profile updated successfully');
      dispatch(login(res.data));
      console.log('Profile Updated:', res.data)
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
              min={18}
              max={100}
            />

            <label className="label">About</label>
            <textarea
              name="about"
              className="textarea textarea-bordered"
              value={formData.about}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            />

            <label className="label">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              className="input input-bordered"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Python"
            />

            <label className="label">College</label>
            <input
              type="text"
              name="college"
              className="input input-bordered"
              value={formData.college}
              onChange={handleChange}
            />

            <label className="label">Company</label>
            <input
              type="text"
              name="company"
              className="input input-bordered"
              value={formData.company}
              onChange={handleChange}
            />

            <label className="label">GitHub ID</label>
            <input
              type="text"
              name="githubId"
              className="input input-bordered"
              value={formData.githubId}
              onChange={handleChange}
            />

            <label className="label">LinkedIn ID</label>
            <input
              type="text"
              name="linkedinId"
              className="input input-bordered"
              value={formData.linkedinId}
              onChange={handleChange}
            />

            <label className="label">Profile Photo</label>
            <input
              type="file"
              className="file-input file-input-bordered"
              accept="image/*"
              onChange={(e) => setPhoto(e.target.files[0])}
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

            {user.photoUrl && <img src={user.photoUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />}
            <p><strong>Name:</strong> {formData.name || '—'}</p>
            <p><strong>Gender:</strong> {formData.gender}</p>
            <p><strong>Age:</strong> {formData.age || '—'}</p>
            <p><strong>About:</strong> {formData.about || '—'}</p>
            <p><strong>Skills:</strong> {formData.skills || '—'}</p>
            <p><strong>College:</strong> {formData.college || '—'}</p>
            <p><strong>Company:</strong> {formData.company || '—'}</p>
            <p><strong>GitHub:</strong> {formData.githubId || '—'}</p>
            <p><strong>LinkedIn:</strong> {formData.linkedinId || '—'}</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default EditProfile
