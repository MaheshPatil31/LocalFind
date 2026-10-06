import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer.jsx';
import Header from './components/layout/Header.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import BusinessDashboardPage from './pages/BusinessDashboardPage.jsx';
import MyBusinessesPage from './pages/MyBusinessesPage.jsx';
import BusinessEditorPage from './pages/BusinessEditorPage.jsx';
import BusinessesPage from './pages/BusinessesPage.jsx';
import BusinessDetailPage from './pages/BusinessDetailPage.jsx';
import MyEnquiriesPage from './pages/MyEnquiriesPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/register" element={<AuthPage mode="register" />} />
          <Route path="/businesses" element={<BusinessesPage />} />
          <Route path="/businesses/:id" element={<BusinessDetailPage />} />
          <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
          <Route path="/enquiries" element={<ProtectedRoute roles={['customer']}><MyEnquiriesPage /></ProtectedRoute>} />
          <Route path="/owner" element={<ProtectedRoute roles={['businessOwner']}><BusinessDashboardPage /></ProtectedRoute>} />
          <Route path="/owner/businesses" element={<ProtectedRoute roles={['businessOwner']}><MyBusinessesPage /></ProtectedRoute>} />
          <Route path="/owner/businesses/new" element={<ProtectedRoute roles={['businessOwner']}><BusinessEditorPage /></ProtectedRoute>} />
          <Route path="/owner/businesses/:businessId/edit" element={<ProtectedRoute roles={['businessOwner']}><BusinessEditorPage editing /></ProtectedRoute>} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
