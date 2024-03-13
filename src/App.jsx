import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PrivatePage from "./pages/PrivatePage";
import NotFoundPage from "./pages/NotFoundPage";
import Navbar from "./components/Navbar";
import PrivateRoutes from "./utils/PrivateRoutes";
import "./App.css";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CGV from "./pages/CgvPage";
import ShowPropertyPage from "./pages/properties/ShowPropertyPage";
import NewPropertyPage from "./pages/properties/NewPropertyPage";
import EditPropertyPage from "./pages/properties/EditPropertyPage";
import IndexPropertyPage from "./pages/properties/IndexPropertyPage";
import Error from "./components/Error";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Error />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<IndexPropertyPage />} />
          <Route path="/properties/:id" element={<ShowPropertyPage />} />
          <Route path="/properties/new" element={<NewPropertyPage />} />
          <Route path="/properties/edit/:id" element={<EditPropertyPage />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/user/password/reset" element={<ResetPasswordPage />} />
          <Route path="/cgv" element={<CGV />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/private" element={<PrivatePage />} />
            <Route path="/properties/my" element={<IndexPropertyPage filter="owned" />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
