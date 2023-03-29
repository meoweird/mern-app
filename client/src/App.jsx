import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Landing from "./components/layout/Landing";
import ProtectedRoute from "./components/routing/ProtectedRoute";
import AuthContextProvider from "./contexts/AuthContext";
import Auth from "./views/Auth";
import Dashboard from "./views/Dashboard";
import NavbarMenu from "./components/layout/NavbarMenu";
import About from "./views/About";
import PostContextProvider from "./contexts/PostContext";

function App() {
  return (
    <AuthContextProvider>
      <PostContextProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Landing />} />
            <Route exact path="/login" element={<Auth authRoute="login" />} />
            <Route
              exact
              path="/register"
              element={<Auth authRoute="register" />}
            />
            <Route
              exact
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <NavbarMenu />
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              exact
              path="/about"
              element={
                <ProtectedRoute>
                  <NavbarMenu />
                  <About />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </PostContextProvider>
    </AuthContextProvider>
  );
}

export default App;
