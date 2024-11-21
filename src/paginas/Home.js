import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import './Home.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
    </div>
  );
}

function WelcomeContainer({ userEmail }) {
  return (
    <div className="welcome-container">
      <h1 className='bemvindo'>Bem-vindo, {userEmail || 'Usuário'}!</h1>
    </div>
  );
}

function ServicesContainer({ services }) {
  return (
    <div className="services-container">
      <h2 className='titulo-service'>Serviços Disponíveis</h2>
      {services.length > 0 ? (
        <ul className="services-list">
          {services.map((service, index) => (
            <li key={index} className="service-box">
              <Link to={`/service/${service.id}`}>
                <div className="service-header">
                  <p className='cabecario-service'>{service.name}</p>
                </div>
                <div className="service-photo-container">
                  <p className='foto-service'>{service.photo && (
                    <img
                      src={`data:image/jpeg;base64,${service.photo}`}
                      alt={service.name}
                      className="service-photo"
                    />
                  )}</p>
                </div>
                <div className="service-footer">
                  <p className='texto-service'>Contato: <strong>{service.userEmail || 'Desconhecido'}</strong></p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum serviço adicionado ainda.</p>
      )}
    </div>
  );
}

function useCookieConsent() {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    const cookieConsent = getCookie('cookieConsent');
    if (cookieConsent) {
      setCookiesAccepted(true);
    }
  }, []);

  const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  const handleAcceptCookies = () => {
    setCookie('cookieConsent', 'accepted', 30);
    setCookiesAccepted(true);
  };

  const handleDeclineCookies = () => {
    setCookie('cookieConsent', 'declined', 30);
    setCookiesAccepted(true);
  };

  return { cookiesAccepted, handleAcceptCookies, handleDeclineCookies };
}

function Home({ services, userEmail }) {
  const [isLoading, setIsLoading] = useState(true);
  const { cookiesAccepted, handleAcceptCookies, handleDeclineCookies } = useCookieConsent();

  useEffect(() => {
    const loadData = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    loadData();
  }, []);
  const carouselItems = [
    { 
      text: `
        Conectando talentos com oportunidades
      `,
      img: '/assets/banner1.jpg' 
    },
    { 
      text: `
      Poste vagas, filtre candidatos e encontre os melhores talentos.
      `,
      img: '/assets/banner2.jpg' 
    },
    { 
      text: `
        Crie seu perfil, encontre vagas e se candidate facilmente.
      `,
      img: '/assets/banner3.png' 
    },
];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      {/* Banner Section */}
      <div className="banner">
        {carouselItems.map((item, index) => (
          <div
            key={index}
            className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${item.img})` }}
          >
            <div className="intro-text">{item.text}</div>
          </div>
        ))}
      </div>

      {/* Conteúdo Principal */}
      <div className="home">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            
            {/* Carrossel Animado */}
            <Slider {...settings} className="banner-carousel">
              <div className="banner-slide">
                <img src="/assets/f2.png" alt="Banner 1" />
              </div>
              <div className="banner-slide">
                <img src="/assets/f3.png" alt="Banner 2" />
              </div>
              <div className="banner-slide">
                <img src="/assets/f4.png" alt="Banner 3" />
              </div>
            </Slider>

       
            <div>
              <section id="servicos" className="services">
                <h2>Serviços</h2>
                <div className="service-item">
                  <img src="/assets/icon-empresa.png" alt="Para Empresas" />
                  <h3>Empresas</h3>
                  <p>Poste vagas, filtre candidatos e encontre os melhores talentos.</p>
                </div>
                <div className="service-item">
                  <img src="/assets/icon-candidato.png" alt="Para Candidatos" />
                  <h3>Candidatos</h3>
                  <p>Crie seu perfil, encontre vagas e se candidate facilmente.</p>
                </div>
                <div className="service-item">
                  <img src="/assets/icon-suporte.png" alt="Suporte e Orientação" />
                  <h3>Suporte e Orientação</h3>
                  <p>Obtenha dicas e suporte para impulsionar sua carreira.</p>
                </div>
              </section>

              <WelcomeContainer userEmail={userEmail} />
              <ServicesContainer services={services} />

              {/* Aviso de Cookies */}
              {!cookiesAccepted && (
                <div className="cookie-notice">
                  <p>Este site utiliza cookies para melhorar sua experiência. Você aceita?</p>
                  <button onClick={handleAcceptCookies}>Aceitar</button>
                  <button onClick={handleDeclineCookies}>Recusar</button>
                  
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
