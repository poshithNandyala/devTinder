import { BrowserRouter, Route, Routes } from "react-router"
import Body from "./components/Body"
import Login from "./components/Login"
import Profile from "./components/Profile"
import Feed from "./components/Feed"
import Settings from "./components/Settings"
import { Provider } from "react-redux"
import appStore from "./utils/store"
import EditProfile from "./components/EditProfile"
import Connections from "./components/Connections"
import Requests from "./components/Requests"
import SentRequests from "./components/SentRequests"
import Chat from "./components/Chat"
import Preferences from "./components/Preferences"


function App() {

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/" element={<Body />} >
              <Route path="/login" element={<Login />} />
              <Route path="/preferences" element={<Preferences />} />
              <Route path="/profile" element={<Profile />} />
              <Route path='/feed' element={<Feed />} />
              <Route path='/settings' element={<Settings />} />
              <Route path='/edit-profile' element={<EditProfile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/sent-requests" element={<SentRequests />} />
              <Route path="/chat/:userId" element={<Chat />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
