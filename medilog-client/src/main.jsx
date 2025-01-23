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
import Services from './pages/common/Services';
import AllDoctors from './dashboard/admins/AllDoctors';
import PatientDashboard from './dashboard/patients/PatientDashboard';
import PatientAppointments from './dashboard/patients/PatientAppointments';
import PatientMedicalRecords from './dashboard/patients/PatientMedicalRecords';


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
        path: "/services",
        element: <Services />,
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
      // Admin routes
      {
        path: "/dashboard/manage-doctors",
        element: <AllDoctors />,
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
        
      }
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
