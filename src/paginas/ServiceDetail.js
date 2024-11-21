import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ServiceDetail.css'; // Estilização personalizada

function ServiceDetail() {
  const { id } = useParams(); // Captura o ID do serviço a partir da URL
  const [service, setService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Buscar os detalhes do serviço usando o ID da URL
    fetch(`http://localhost:5000/api/service/${id}`)
      .then(response => response.json())
      .then(data => {
        setService(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar os detalhes do serviço:', error);
        setIsLoading(false);
      });
  }, [id]);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!service) {
    return <div>Serviço não encontrado.</div>;
  }

  return (
    <div className="service-detail">
      <div className="service-container">
        <div className="service-image">
          {service.photo ? (
            <img
              src={`data:image/jpeg;base64,${service.photo}`}
              alt={service.name}
              className="service-photo"
            />
          ) : (
            <img src="/assets/placeholder.jpg" alt="Placeholder" className="service-photo" />
          )}
        </div>

        <div className="service-info">
          <h1>{service.name}</h1>
          <p className="service-price">R$ {service.rate} / hora</p>
          <p className="service-description">{service.description}</p>

          <div className="service-location">
            <span>Localização: {service.location}</span>
          </div>

          <div className="service-user">
            <span>Vendido por: {service.userEmail}</span>
          </div>

          <div className="service-actions">
            <button className="btn-contact">Entrar em contato</button>
            <button className="btn-buy">Comprar Serviço</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
