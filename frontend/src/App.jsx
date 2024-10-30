import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Supplier from "./pages/Supplier";
import Item from "./pages/Item";
import Purchase from "./pages/Purchase";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/suppliers" element={<Supplier />} />
        <Route path="/items" element={<Item />} />
        <Route path="/purchase" element={<Purchase />} />
      </Routes>
    </div>
  );
}

export default App;
