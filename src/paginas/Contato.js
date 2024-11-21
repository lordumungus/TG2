import React, { useState, useEffect } from 'react';
import './Home.css'; // Certifique-se de criar e ajustar o arquivo CSS

function Contato() {
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    const loadData = async () => {
      setTimeout(() => {
        setLoading(false); // Após simular o carregamento, desativa o loading
      }, 2000); // Simula um carregamento de 2 segundos
    };
    loadData();
  }, []);

  function LoadingSpinner() {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="contato-container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h1>Contato com os Desenvolvedores</h1>
          <p>
            Se você tem alguma dúvida ou feedback sobre o nosso software, sinta-se à vontade para entrar em contato com nossa equipe de desenvolvimento. Estamos aqui para ajudar!
          </p>
          <div className="team-members">
            <h2>Nossos Desenvolvedores:</h2>
            <div className="developer-columns">
              <div className="developer">
                <strong>Alessandro:</strong>
                <p>Especialista em Frontend, responsável pela interface do usuário.</p>
              </div>
              <div className="developer">
                <strong>Matheus:</strong>
                <p>Desenvolvedor Backend, encarregado das funcionalidades do servidor e banco de dados.</p>
              </div>
              <div className="developer">
                <strong>Gabriel:</strong>
                <p>Engenheiro de Software, cuida da arquitetura geral e integração de sistemas.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Contato;
