const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const CryptoJS = require('crypto-js'); // Importando a biblioteca CryptoJS

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuração do multer para armazenar a imagem em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./banco/database.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    
    // Criar a tabela de usuários se não existir
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      nome TEXT,
      cpf TEXT,
      telefone TEXT,
      endereco TEXT,
      numeroCasa TEXT
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela de usuários:', err.message);
      } else {
        console.log('Tabela de usuários garantida.');
      }
    });
    
    // Criar a tabela de serviços se não existir
    db.run(`CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      rate INTEGER NOT NULL,
      description TEXT,
      location TEXT,
      photo BLOB,
      userEmail TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('Erro ao criar a tabela de serviços:', err.message);
      } else {
        console.log('Tabela de serviços garantida.');
      }
    });
  }
});

// Rota para registrar novo usuário
app.post('/register', (req, res) => {
  const { email, password, nome, cpf, telefone, endereco, numeroCasa } = req.body;

  if (email && password && nome && cpf && telefone && endereco && numeroCasa) {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error('Erro ao verificar email:', err.message);
        return res.status(500).json({ error: 'Erro ao verificar email' });
      }

      if (row) {
        return res.status(400).json({ error: 'Email já cadastrado' });
      }

   

      db.run(
        'INSERT INTO users (email, password, nome, cpf, telefone, endereco, numeroCasa) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [email, password, nome, cpf, telefone, endereco, numeroCasa],
        (err) => {
          if (err) {
            console.error('Erro ao registrar usuário:', err.message);
            return res.status(500).json({ error: 'Erro ao registrar usuário' });
          } else {
            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
          }
        }
      );
    });
  } else {
    res.status(400).json({ error: 'Dados incompletos' });
  }
});

// Rota para login de usuário
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (email && password) {
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
      if (err) {
        console.error('Erro ao consultar o banco de dados:', err.message);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (row) {
        // Descriptografar a senha armazenada
        const decryptedPassword = CryptoJS.AES.decrypt(row.password, 'chave-secreta').toString(CryptoJS.enc.Utf8);
        const recriptado = CryptoJS.AES.decrypt(decryptedPassword, 'chave-secreta').toString();
        const encryptedPassword = CryptoJS.AES.encrypt(password, 'chave-secreta').toString();
       
    
        
     
        console.log('row.password:', row.password);
        console.log('decryptedPassword:', decryptedPassword);
        console.log('recriptado:', recriptado);
        console.log('teste:',encryptedPassword);
        console.log('password:', password);

        if (password === decryptedPassword) {
          res.status(200).json({ message: 'Login bem-sucedido', user: row });
        } else {
          console.log('Senha incorreta:', row.password);
          res.status(401).json({ error: 'Email ou senha incorretos' });
        }
      } else {
        res.status(401).json({ error: 'Email ou senha incorretos' });
      }
    });
  } else {
    res.status(400).json({ error: 'Dados incompletos' });
  }
});


// Rota para adicionar serviço
app.post('/add-service', upload.single('photo'), (req, res) => {
  const { name, rate, description, location, userEmail } = req.body;
  const photo = req.file ? req.file.buffer : null;

  if (name && rate && description && location && userEmail) {
    db.run(
      'INSERT INTO services (name, rate, description, location, photo, userEmail) VALUES (?, ?, ?, ?, ?, ?)',
      [name, rate, description, location, photo, userEmail],
      (err) => {
        if (err) {
          console.error('Erro ao adicionar serviço:', err.message);
          res.status(500).json({ error: 'Erro ao adicionar serviço' });
        } else {
          res.status(201).json({ message: 'Serviço adicionado com sucesso!' });
        }
      }
    );
  } else {
    res.status(400).json({ error: 'Dados incompletos' });
  }
});

// Rota para buscar todos os serviços
app.get('/api/services', (req, res) => {
  db.all('SELECT * FROM services', [], (err, rows) => {
    if (err) {
      console.error('Erro ao buscar serviços:', err.message);
      res.status(500).json({ error: 'Erro ao buscar serviços' });
    } else {
      const servicesWithImage = rows.map(row => ({
        ...row,
        photo: row.photo ? Buffer.from(row.photo).toString('base64') : null
      }));
      res.json(servicesWithImage);
    }
  });
});

// Rota para buscar detalhes de um serviço específico
app.get('/api/service/:id', (req, res) => {
  const serviceId = req.params.id;

  db.get('SELECT * FROM services WHERE id = ?', [serviceId], (err, row) => {
    if (err) {
      console.error('Erro ao buscar serviço:', err.message);
      res.status(500).json({ error: 'Erro ao buscar serviço' });
    } else if (row) {
      // Convertendo a imagem em base64 se ela existir
      const serviceWithImage = {
        ...row,
        photo: row.photo ? Buffer.from(row.photo).toString('base64') : null
      };
      res.json(serviceWithImage);
    } else {
      res.status(404).json({ error: 'Serviço não encontrado' });
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
