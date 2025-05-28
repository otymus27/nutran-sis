import './global.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/Login/LoginPage';
import HomePage from './pages/Home/HomePage';
import CarrosPage from './pages/Carros/CarrosPage.jsx';
import SetorPage from './pages/Setor/SetorPage.jsx';
import DestinoPage from './pages/Destino/DestinoPage.jsx';
import UsuariosPage from './pages/Usuarios/UsuariosPage';
import MotoristasPage from './pages/Motoristas/MotoristasPage';
import SolicitacaoPage from './pages/Solicitacao/SolicitacaoPage.jsx';
import SobrePage from './pages/Sobre/SobrePage.jsx';

function App() {
  return (
    <>
      {/* // <SnackbarProvider>      */}
      {/* Envolvendo toda a aplicação com o SnackbarProvider */}
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <HomePage />
                </PrivateRoute>
              }
            />

            <Route
              path="/carro"
              element={
                <PrivateRoute>
                  <CarrosPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/usuarios"
              element={
                <PrivateRoute>
                  <UsuariosPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/motorista"
              element={
                <PrivateRoute>
                  <MotoristasPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/setor"
              element={
                <PrivateRoute>
                  <SetorPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/destino"
              element={
                <PrivateRoute>
                  <DestinoPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/solicitacao"
              element={
                <PrivateRoute>
                  <SolicitacaoPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/sobre"
              element={
                <PrivateRoute>
                  <SobrePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
      {/* // </SnackbarProvider> */}
    </>
  );
}

export default App;
