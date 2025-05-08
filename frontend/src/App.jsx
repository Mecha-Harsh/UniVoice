import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './home';
import LoginPage2 from './loginpage2';
import Admin from './admin';
import PostNews from './postNews';
import ViewNews from './viewNews';
import { UserProvider } from './context/UserContext';
import ProfilePage from "./components/ProfilePage";
import ContactUs from "./components/ContactUs";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<LoginPage2 />} />
          <Route path='/' element={<Home />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/post' element={<PostNews />} />
          <Route path='/viewNews/:slug' element={<ViewNews />} />
          <Route path="/profile" element={<ProfilePage />} /> {/* ✅ Profile Route */}
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
