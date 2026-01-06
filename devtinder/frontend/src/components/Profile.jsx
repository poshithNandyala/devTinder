import { useSelector } from 'react-redux'
import { Link } from 'react-router'

function Profile() {
  const user = useSelector(state => state.user)

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-16 h-16 rounded-full bg-stone-800/50 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-rose-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl font-light tracking-wide mb-2 text-stone-200">Access Required</h2>
        <p className="text-stone-500 text-sm mb-6">Please sign in to view your profile</p>
        <Link to="/login" className="px-4 py-2 bg-rose-600 text-white text-sm rounded-lg hover:bg-rose-700 transition-colors tracking-wider">
          Sign In
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="bg-stone-900/30 backdrop-blur-sm border border-stone-800/30 rounded-2xl overflow-hidden">
          {/* Header Gradient */}
          <div className="h-24 bg-gradient-to-r from-rose-600/20 via-rose-500/10 to-rose-700/20"></div>

          <div className="px-6 pb-8">
            {/* Avatar */}
            <div className="flex justify-center -mt-12 mb-6">
              <div className="w-24 h-24 rounded-full ring-4 ring-stone-950 overflow-hidden">
                <img
                  src={user.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&size=128&background=1c1917&color=e11d48`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name & Basic Info */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-light tracking-wide text-stone-100">{user.name}</h1>
              <p className="text-stone-500 text-sm mt-1 capitalize">{user.gender} · {user.age}</p>
              <p className="text-stone-600 text-xs mt-1">{user.email}</p>
            </div>

            {/* About */}
            {user.about && (
              <div className="mb-6">
                <p className="text-sm text-stone-400 text-center leading-relaxed">{user.about}</p>
              </div>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {(Array.isArray(user.skills) ? user.skills : [user.skills]).map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs bg-rose-600/10 text-rose-400 rounded-full border border-rose-600/20">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Details */}
            {(user.college || user.company) && (
              <div className="flex flex-col items-center gap-2 mb-6 text-sm text-stone-500">
                {user.college && <span>{user.college}</span>}
                {user.company && <span>{user.company}</span>}
              </div>
            )}

            {/* Social Links */}
            {(user.githubId || user.linkedinId) && (
              <div className="flex justify-center gap-6 mb-8">
                {user.githubId && (
                  <a
                    href={`https://github.com/${user.githubId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-stone-500 hover:text-rose-500 transition-colors"
                  >
                    GitHub
                  </a>
                )}
                {user.linkedinId && (
                  <a
                    href={`https://linkedin.com/in/${user.linkedinId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-stone-500 hover:text-rose-500 transition-colors"
                  >
                    LinkedIn
                  </a>
                )}
              </div>
            )}

            {/* Edit Button */}
            <Link 
              to="/edit-profile" 
              className="block w-full py-3 text-center border border-rose-600 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-colors tracking-wider text-sm"
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
