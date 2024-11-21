import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import InputMask from 'react-input-mask';
import './Cadastro.css';

function Cadastro() {
  const [currentStep, setCurrentStep] = useState(1); // Controla a etapa do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para exibir/ocultar senha
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Exibir/ocultar confirmação de senha
  const [nome, setNome] = useState('');
  const [idade, setIdade] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [cep, setCep] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  function LoadingSpinner() {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  const handleCepChange = async (e) => {
    const cepValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    setCep(cepValue);

    if (cepValue.length === 8) {
      try {
        setLoading(true);
        const response = await fetch(`https://viacep.com.br/ws/${cepValue}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setEndereco(data.logradouro);
          setBairro(data.bairro);
          setCidade(data.localidade);
          setEstado(data.uf);
          setNumeroCasa('');
        } else {
          setMessage('CEP não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        setMessage('Erro ao buscar endereço. Tente novamente.');
      } finally {
        setLoading(false);
      }
    } else {
      setEndereco('');
      setBairro('');
      setCidade('');
      setEstado('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!termsAccepted) {
      setMessage('Por favor, aceite os Termos e Condições para continuar.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('As senhas não coincidem.');
      return;
    }

    const encryptedPassword = CryptoJS.AES.encrypt(password, 'chave-secreta').toString();

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: encryptedPassword,
          nome,
          idade,
          cpf,
          telefone,
          endereco,
          bairro,
          cidade,
          estado,
          numeroCasa,
          cep,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Cadastro realizado com sucesso!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setMessage('Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (email === '' || password === '' || confirmPassword === '') {
        setMessage('Por favor, preencha todos os campos obrigatórios antes de continuar.');
        return;
      }

      if (password !== confirmPassword) {
        setMessage('As senhas não coincidem.');
        return;
      }

      setMessage('');
      setCurrentStep(2); // Avança para a segunda etapa
    } else if (currentStep === 2) {
      if (nome === '' || idade === '' || cpf === '' || telefone === '') {
        setMessage('Por favor, preencha todos os campos obrigatórios antes de continuar.');
        return;
      }

      setMessage('');
      setCurrentStep(3); // Avança para a terceira etapa
    }
  };

  return (
    <div className="cadastro-container">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <h2>Cadastro</h2>
          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="form-section">
                <h3>Dados de Acesso</h3>
                <div className="form-group">
                  <label htmlFor="email">E-mail:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
  <label htmlFor="password">Senha:</label>
  <div className="password-wrapper">
    <input
      type={showPassword ? 'text' : 'password'}
      id="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
    <span
      className="toggle-password"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? '🙈' : '👁️'}
    </span>
  </div>
</div>
<div className="form-group">
  <label htmlFor="confirmPassword">Confirme a Senha:</label>
  <div className="password-wrapper">
    <input
      type={showConfirmPassword ? 'text' : 'password'}
      id="confirmPassword"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      required
    />
    <span
      className="toggle-password"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    >
      {showConfirmPassword ? '🙈' : '👁️'}
    </span>
  </div>
</div>

                <button className='btCad' type="button" onClick={handleNextStep}>
                  Próximo
                </button>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-section">
                <h3>Dados Pessoais</h3>
                <div className="form-group">
                  <label htmlFor="nome">Nome Completo:</label>
                  <input
                    type="text"
                    id="nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="idade">Idade:</label>
                  <input
                    type="number"
                    id="idade"
                    value={idade}
                    onChange={(e) => setIdade(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cpf">CPF:</label>
                  <InputMask
                    mask="999.999.999-99"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefone">Telefone:</label>
                  <InputMask
                    mask="(99) 99999-9999"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    required
                  />
                </div>
                <button className='btCad' type="button" onClick={handleNextStep}>
                  Próximo
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-section">
                <h3>Endereço</h3>
                <div className="form-group">
                  <label htmlFor="cep">CEP:</label>
                  <InputMask
                    mask="99999-999"
                    value={cep}
                    onChange={handleCepChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="endereco">Endereço:</label>
                  <input
                    type="text"
                    id="endereco"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bairro">Bairro:</label>
                  <input
                    type="text"
                    id="bairro"
                    value={bairro}
                    onChange={(e) => setBairro(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cidade">Cidade:</label>
                  <input
                    type="text"
                    id="cidade"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="estado">Estado:</label>
                  <input
                    type="text"
                    id="estado"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="numeroCasa">Número:</label>
                  <input
                    type="text"
                    id="numeroCasa"
                    value={numeroCasa}
                    onChange={(e) => setNumeroCasa(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={() => setTermsAccepted(!termsAccepted)}
                    />
                    Aceito os Termos e Condições
                  </label>
                </div>
                <button type="submit">Cadastrar</button>
              </div>
            )}
          </form>
          {message && <p>{message}</p>}
        </>
      )}
    </div>
  );
}

export default Cadastro;
