import { BrowserRouter } from "react-router-dom";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./components/Context/AuthProvider";
import VendorLocationInitializer from "./components/vendorLocationInitializer";

function App() {
  return (
    <BrowserRouter>
      <VendorLocationInitializer />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
