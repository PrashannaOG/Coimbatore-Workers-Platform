import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import WorkerRegister from './pages/WorkerRegister'
import EmployerRegister from './pages/EmployerRegister'
import ForgotPassword from './pages/ForgotPassword'
import WorkerDashboard from './dashboard/worker/WorkerDashboard'
import Jobs from './pages/Jobs'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login/>}
        />

        <Route
          path="/register/worker"
          element={<WorkerRegister/>}
        />

        <Route
          path="/register/employer"
          element={<EmployerRegister/>}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword/>}
        />

        <Route
          path="/worker/dashboard"
          element={<WorkerDashboard/>}
        />

        <Route path="/jobs" element={<Jobs />} />
      </Routes>

      <Footer />
    </>
  )
}

export default App