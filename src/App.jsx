import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import WorkerRegister from './pages/WorkerRegister'
import EmployerRegister from './pages/EmployerRegister'
import ForgotPassword from './pages/ForgotPassword'
import WorkerDashboard from './dashboard/worker/WorkerDashboard'
import WorkerApplications from './dashboard/worker/WorkerApplications'
import Jobs from './pages/Jobs'
import EmployerDashboard from './dashboard/employer/EmployerDashboard' 
import EmployerJobs from './dashboard/employer/EmployerJobs'
import EmployerApplications from './dashboard/employer/EmployerApplications' 
import WorkerProfile from './dashboard/worker/WorkerProfile'
import PostJob from './dashboard/employer/PostJob'
import EditJob from './dashboard/employer/EditJob';
import WorkerSettings from './dashboard/worker/WorkerSettings'



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

        <Route path="/worker/applications" element={<WorkerApplications />} />

        <Route
          path="/employer/dashboard"
          element={<EmployerDashboard />}
        />

        <Route
  path="/employer/jobs"
  element={<EmployerJobs />}
/>

<Route path="/employer/applications" element={<EmployerApplications />} />

        <Route
  path="/employer/post-job"
  element={<PostJob />}
/>

        <Route path="/worker/profile" element={<WorkerProfile />} />

        <Route path="/worker/settings" element={<WorkerSettings />} />

        <Route path="/jobs" element={<Jobs />} />

        <Route
    path="/employer/jobs/:jobId/edit"
    element={<EditJob />}
/>
      </Routes>

      <Footer />
    </>
  )
}

export default App