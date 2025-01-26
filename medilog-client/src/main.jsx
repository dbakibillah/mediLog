import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from './routes/Root';
import Home from './pages/common/Home';
import Login from './pages/common/Login';
import Register from './pages/common/Register';
import AuthProvider from './providers/AuthProviders';
import OrderTests from './pages/orderTest/OrderTests';
import DoctorDetails from './pages/doctors/DoctorDetails';
import Consultation from './pages/common/Consultation';
// tanstackQuery
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import Dashboard from './dashboard/Dashboard';
import PatientDashboard from './dashboard/patients/PatientDashboard';
import PatientAppointments from './dashboard/patients/PatientAppointments';
import PatientMedicalRecords from './dashboard/patients/PatientMedicalRecords';
import AdminDoctors from './dashboard/admins/AdminDoctors';
import AdminAppointments from './dashboard/admins/AdminAppointments';
import PatientPrescriptions from './dashboard/patients/PatientPrescriptions';
import AdminPatients from './dashboard/admins/AdminPatients';
import AdminDashboard from './dashboard/admins/AdminDashboard';
import EditProfile from './dashboard/EditProfile';
import DoctorDashboard from './dashboard/doctors/DoctorDashboard';
import DoctorAppointments from './dashboard/doctors/DoctorAppointments';


const queryClient = new QueryClient()
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/ordertests",
        element: <OrderTests />,
      },
      {
        path: "/consultation",
        element: <Consultation />,
      },
      {
        path: "/doctors/:id",
        element: <DoctorDetails />
      }
    ]
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      // common routes
      {
        path: "/dashboard/profile",
        element: <EditProfile />,
      },
      // Admin routes
      {
        path: "/dashboard/admin-dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/dashboard/manage-doctors",
        element: <AdminDoctors />,
      },
      {
        path: "/dashboard/admin-appointments",
        element: <AdminAppointments />,
      },
      {
        path: "/dashboard/admin-patients",
        element: <AdminPatients />,
      },
      // Patients routes
      {
        path: "/dashboard/patient-dashboard",
        element: <PatientDashboard />,
      },
      {
        path: "/dashboard/patient-appointments",
        element: <PatientAppointments />,
      },
      {
        path: "/dashboard/patient-medical-records",
        element: <PatientMedicalRecords />,
      },
      {
        path: "/dashboard/patient-prescriptions",
        element: <PatientPrescriptions />,
      },
      {
        path: "/dashboard/doctor-dashboard",
        element: <DoctorDashboard />,
      },
      {
        path: "/dashboard/doctor-appointments",
        element: <DoctorAppointments />,
      },
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
)
