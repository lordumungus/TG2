import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';
import './App.css';
import Categories from './paginas/Categories';
import Ofertas from './paginas/Ofertas';
import Contato from './paginas/Contato';
import Home from './paginas/Home';
import Termos from './paginas/Termos';
import AddService from './paginas/AddService';
import Login from './paginas/Login';
import Cadastro from './paginas/Cadastro';
import Rodape from './paginas/Rodape'; // Importando o componente Rodape
import ServiceDetail from './paginas/ServiceDetail';
import axios from 'axios';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNavScrolled, setIsNavScrolled] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setIsAuthenticated(true);
      setUserEmail(storedEmail);
    }

    axios.get('http://localhost:5000/api/services')
      .then(response => {
        setServices(response.data);
      })
      .catch(error => {
        console.error('Houve um erro ao buscar os serviços!', error);
      });
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
    }

    // Detect scroll for Navbar
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsNavScrolled(true);
      } else {
        setIsNavScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (email) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('userEmail', email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    localStorage.removeItem('userEmail');
  };

  const handleRegister = (email, password) => {
    console.log("Usuário cadastrado:", email);
  };

  const handleAddService = (newService) => {
    setServices([...services, newService]);
    setShowAddService(false);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <Router>
      <div className={`app ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
        <header className={`header ${isNavScrolled ? 'scrolled' : ''}`}>
          <div className="logo">
            <Link to="/"> {/* Envolva o nome da empresa em um Link para redirecionar para a Home */}
              <img src="/assets/logo.png"alt="HiringScope"/>
            </Link>
          </div>
          <nav className="nav">
        
            <Link to="/">Home</Link>
            <Link to="/categories">Categorias</Link>
            <Link to="/offers">Ofertas</Link>
            <Link to="/contact">Contato</Link>
            <Link to="/cadastro">Cadastro</Link>
            {isAuthenticated ? (
              <>
             
                <Link onClick={() => setShowAddService(true)}>Adicionar Serviço</Link>
                 <Link to="/" onClick={handleLogout}>Logout</Link>
              </>           
               ) : (
              <Link to="/login">Login</Link>
            )}
            {isAuthenticated && (
              <span className="user-email">{userEmail}</span>
            )}
            <button className="toggle-theme-btn" onClick={toggleTheme}>
              {isDarkMode ? '🔅' : '🌙'}
            </button>
        
          </nav>
        </header>
        
        <main className="main">
          <Routes>
            <Route path="/" element={<Home services={services} userEmail={userEmail} />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/offers" element={<Ofertas />} />
            <Route path="/contact" element={<Contato />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/cadastro" element={<Cadastro onRegister={handleRegister} />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/service/:id" element={<ServiceDetail />} />
          </Routes>
          {showAddService && <AddService onAddService={handleAddService} userEmail={userEmail} />}
        </main>

        <section id="contato" class="contact">
        <h2>Entre em Contato</h2>
        <p>Tem alguma dúvida? Estamos aqui para ajudar!</p>
        <a href="mailto:contato@hiringscope.com" class="contact-button">Fale Conosco</a>
    </section>

    <footer>
        <p>&copy; 2024 HiringScope. Todos os direitos reservados.</p>
        <img src="/assets/logo3.png" alt="Logo" className="logo3" />
        </footer>
        <Rodape />
      </div>
    </Router>
  );
}

export default App;
