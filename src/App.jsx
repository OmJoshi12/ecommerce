import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './pages/Login';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Layout from './components/Layout/Layout';
import { fetchMe } from './features/auth/authSlice';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchMe());
    }
  }, [dispatch, token, user]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={token ? '/home' : '/login'} replace />} />
      <Route path="/login" element={token ? <Navigate to="/home" replace /> : <Login />} />

      <Route element={token ? <Layout /> : <Navigate to="/" replace />}>
        <Route path="/home" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      <Route path="*" element={<Navigate to={token ? '/home' : '/'} replace />} />
    </Routes>
  );
}

export default App;
