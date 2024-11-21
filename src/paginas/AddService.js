import React, { useState } from 'react';
import './AddService.css';

function AddService({ onAddService, userEmail }) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [serviceName, setServiceName] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    setServiceName('');
    setHourlyRate('');
    setDescription('');
    setLocation('');
    setPhoto(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (serviceName.trim() && hourlyRate.trim() && description.trim() && location.trim()) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', serviceName);
      formData.append('rate', hourlyRate);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('photo', photo);
      formData.append('userEmail', userEmail);

      fetch('http://localhost:5000/add-service', {
        method: 'POST',
        body: formData,
      })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data.message) {
          alert(data.message);
          onAddService({ name: serviceName, rate: hourlyRate, description, location, userEmail });
          closeModal();
        } else if (data.error) {
          alert(data.error);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Erro ao adicionar serviço:', error);
      });
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2 className='titiloServico'>Adicionar Serviço</h2>
            {isLoading ? (
              <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Adicionando serviço...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="serviceName">Nome do Serviço:</label>
                  <input
                    type="text"
                    id="serviceName"
                    name="serviceName"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="hourlyRate">Valor por Hora:</label>
                  <input
                    type="number"
                    id="hourlyRate"
                    name="hourlyRate"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Descrição:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Local:</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="photo">Foto do Serviço:</label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </div>
                <button type="submit">Adicionar Serviço</button>
                <button type="button" className="close-btn" onClick={closeModal}>Fechar</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddService;
