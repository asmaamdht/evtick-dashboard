import { RouterProvider } from "react-router-dom";
import router from "./router/AppRoutes";
import AuthListener from "./auth/AuthListener";  // ✅ استورد AuthListener
import "./App.css";

function App() {
  return (
    <AuthListener>
      <RouterProvider router={router} />
    </AuthListener>
  );
}

export default App;