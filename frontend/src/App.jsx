import {Route, Routes, BrowserRouter} from "react-router-dom";
import MainWrapper from "./layouts/MainWrapper"
import PrivRoute from "./layouts/PrivRoutes"
import Register from "./views/auth/Register"
import Login from "./views/auth/Login"
import Logout from "./views/auth/Logout"
import ResetPassword from "./views/auth/ResetPassword"

function App() {
  return (
    <BrowserRouter>
      <MainWrapper>
        <Routes>
          <Route path="/register/" element={<Register/>}/>
          <Route path="/login/" element={<Login/>}/>
          <Route path="/logout/" element={<Logout/>}/>
          <Route path="/reset-password/" element={<ResetPassword/>}/>
        </Routes>
      </MainWrapper>
    </BrowserRouter>
  )
}

export default App
