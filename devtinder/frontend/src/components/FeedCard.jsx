import { useCallback, useState } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { BASE_URL } from "../utils/constants"
import { removeFeed } from "../utils/slices/feedSlice"

function FeedCard({ user }) {
  const dispatch = useDispatch()
  const [actionLoading, setActionLoading] = useState(null)

  const { _id, name, age, gender, photoUrl, about, skills, college, company, githubId, linkedinId } = user || {}

  const handleStatus = useCallback(
    async (status) => {
      if (!_id || actionLoading) return

      setActionLoading(status)
      try {
        await axios.post(
          `${BASE_URL}/connection/send/${status}/${_id}`,
          {},
          { withCredentials: true }
        )

        dispatch(removeFeed(_id))
        if (status === 'request') {
          toast.success(`Interest sent to ${name}`)
        }
      } catch (error) {
        console.error(error)
        toast.error(error?.response?.data || "Something went wrong")
      } finally {
        setActionLoading(null)
      }
    },
    [_id, dispatch, actionLoading, name]
  )

  if (!user) return null

  return (
    <div className="w-full max-w-sm bg-stone-900/50 backdrop-blur-sm border border-stone-800/30 rounded-2xl overflow-hidden group shadow-2xl">
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'U')}&size=400&background=1c1917&color=e11d48&bold=true`}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent"></div>
        
        {/* Name & Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h2 className="text-2xl font-light tracking-wide text-white">{name}</h2>
          <p className="text-white/60 text-sm tracking-wider capitalize mt-1">
            {age} · {gender}
          </p>
        </div>
      </div>

      <div className="p-6 pt-4">
        {/* About */}
        {about && (
          <p className="text-sm text-stone-400 leading-relaxed line-clamp-2">{about}</p>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {skills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="px-2.5 py-1 text-xs bg-rose-600/10 text-rose-400 rounded-full border border-rose-600/20">
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2.5 py-1 text-xs bg-stone-800/50 text-stone-500 rounded-full">
                +{skills.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Details */}
        {(college || company) && (
          <div className="flex flex-col gap-1 mt-3 text-xs text-stone-500">
            {college && <span>{college}</span>}
            {company && <span>{company}</span>}
          </div>
        )}

        {/* Social Links */}
        {(githubId || linkedinId) && (
          <div className="flex gap-4 mt-3">
            {githubId && (
              <a
                href={`https://github.com/${githubId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stone-500 hover:text-rose-500 transition-colors"
              >
                GitHub
              </a>
            )}
            {linkedinId && (
              <a
                href={`https://linkedin.com/in/${linkedinId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stone-500 hover:text-rose-500 transition-colors"
              >
                LinkedIn
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => handleStatus("ignored")}
            className="flex-1 py-3 bg-transparent border border-stone-700 text-stone-400 rounded-lg hover:border-red-500/50 hover:text-red-400 transition-colors flex items-center justify-center"
            disabled={!!actionLoading}
          >
            {actionLoading === "ignored" ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Pass"
            )}
          </button>

          <button
            onClick={() => handleStatus("request")}
            className="flex-1 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors flex items-center justify-center"
            disabled={!!actionLoading}
          >
            {actionLoading === "request" ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Interested"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedCard
