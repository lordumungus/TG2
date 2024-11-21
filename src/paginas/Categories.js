import React, { useState, useEffect } from 'react';
import './Categoria.css'; // Supondo que o estilo do Spinner esteja aqui

function Categories() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando o tempo de carregamento
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer); // Limpeza do timer ao desmontar o componente
  }, []);

  function LoadingSpinner() {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="login-form">
      <h1>Categorias de Serviços</h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
       <>
        <button className="botao-cat">Consultoria</button>
        <button className="botao-cat">Design Gráfico</button>
        <button className="botao-cat">Desenvolvimento Web</button>
        <button className="botao-cat">Marketing Digital</button>
        <button className="botao-cat">Suporte Técnico</button>
       </>
      )}
    </div>
  );
}

export default Categories;
