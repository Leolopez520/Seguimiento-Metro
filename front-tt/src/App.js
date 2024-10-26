import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ManageConvoysScreen from './screens/ManageConvoyScreen';
import ResetPassword from './screens/ResetPasswordScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/signup" element={<SignupScreen />} />
        <Route path="forgotpassword" element= {<ForgotPasswordScreen/>}/>
        <Route path="/manageconvoy" element= {<ManageConvoysScreen/>}/>
        <Route path="/resetear/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;