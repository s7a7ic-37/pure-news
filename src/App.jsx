import { useState } from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import './App.css';
import { UserContext } from '../contexts/UserContext';
import Header from '../components/Header';
import SignIn from '../components/SignIn';
import Nav from '../components/Nav';
import ArticleList from '../components/ArticleList';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const [user, setUser] = useState("weegembump");

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <>
        <Header />
        {!isLoginPage && <Nav />}
        <Routes>
          <Route path="/" element={<SignIn setUser={ setUser } />}></Route>
          <Route path='/home' element={<ArticleList />}></Route>
        </Routes>
      </>
    </UserContext.Provider>
  );
}

export default App;
