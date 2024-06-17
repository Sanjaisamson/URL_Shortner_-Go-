import './App.css'
import { Login } from './components/login'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Dashboard } from './components/dashboard';
import { MainPage } from './components/mainpage';
import { OutputPage } from './components/output';
import { LinksPage } from './components/links';
import { Register } from './components/register';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/url" element={<MainPage/>}/>
          <Route path="/output" element={<OutputPage/>}/>
          <Route path="/links" element={<LinksPage/>}/>
        </Routes>
  </BrowserRouter>
  )
}

export default App
