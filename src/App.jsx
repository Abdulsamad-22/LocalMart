import { BrowserRouter } from "react-router-dom";
import "./App.css";

import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./components/Context/AuthProvider";
import VendorLocationProvider from "./components/Context/deliveryTime/VendorLocationProvider";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <VendorLocationProvider>
          <AppRoutes />
        </VendorLocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
