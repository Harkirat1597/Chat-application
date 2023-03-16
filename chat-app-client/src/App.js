import Auth from "./Pages/Auth.js";
import Dashboard from "./Pages/Dashboard.js";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext.js";

function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route exact path={"/dashboard"} element={<Dashboard />} />  
        <Route exact path={"/"} element={<Auth />} />
      </Routes>    
    </AuthProvider>
    </BrowserRouter>

  );
}

export default App;
