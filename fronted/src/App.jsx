import {  BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Produk from "./pages/produk";

function App(){
  return (
    <BrowserRouter>
    <Routes>
     <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/produk" element={<Produk />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;