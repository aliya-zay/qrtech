const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const multer = require('multer');
const crypto = require('crypto');

// Загружаем наши модули работы с БД
const { getUserByEmail, createUser } = require('./db/users');
const {
  saveQrCode,
  getUserQrCodes,
  toggleFavorite,
  deleteQrCode,
  updateQrCodeTitle
} = require('./db/qrcodes');


const app = express();
const port = 3000;

// Настройки загрузки файлов
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });

// Мидлвары
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'your_secret_key', // замени на .env в будущем
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// Проверка авторизации
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next();
  } else {
    res.redirect('/');
  }
}

// Регистрация
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(name, email, hashedPassword);

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration error' });
  }
});

// Вход
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.user = { email: user.mail };
    res.status(200).json({ message: 'Login successful', redirect: '/qr-generator' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login error' });
  }
});

// Генерация случайного названия
function generateRandomTitle() {
  return crypto.randomBytes(10).toString('hex');
}

// Создание QR-кода
app.post('/qrcodes/create', requireLogin, upload.single('qrCodeImage'), async (req, res) => {
  try {
    const file = req.file;
    const title = req.body.title;
    const email = req.session.user.email;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const imageBase64 = file.buffer.toString('base64');
    const finalTitle = title || generateRandomTitle();

    await saveQrCode(email, imageBase64, finalTitle);
    res.status(201).json({ message: 'QR-код успешно сохранен!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при сохранении QR-кода' });
  }
});

// Получение всех QR-кодов
app.get('/qrcodes/myqrcodes', requireLogin, async (req, res) => {
  try {
    const email = req.session.user.email;
    const sortBy = req.query.sortBy || 'created_at';
    const qrCodes = await getUserQrCodes(email, null, sortBy);
    res.status(200).json(qrCodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка получения QR-кодов.' });
  }
});

// Получение избранных QR-кодов
app.get('/qrcodes/myfavorites', requireLogin, async (req, res) => {
  try {
    const email = req.session.user.email;
    const qrCodes = await getUserQrCodes(email, true);
    res.status(200).json(qrCodes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка получения избранных QR-кодов.' });
  }
});

// Добавление/удаление из избранного
app.post('/qrcodes/favorite', requireLogin, async (req, res) => {
  try {
    const { qrId } = req.body;
    const email = req.session.user.email;
    const codes = await getUserQrCodes(email);
    const code = codes.find(code => code.id === qrId);

    if (!code) return res.status(404).json({ message: 'QR-код не найден.' });

    const newIsFavorite = !code.is_favorite;
    await toggleFavorite(qrId, newIsFavorite);
    res.status(200).json({ is_favorite: newIsFavorite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при обновлении избранного.' });
  }
});

// Удаление QR-кода
app.post('/qrcodes/delete', requireLogin, async (req, res) => {
  try {
    const { qrId } = req.body;
    const email = req.session.user.email;
    await deleteQrCode(qrId, email);
    res.status(200).json({ message: 'QR-код удален' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка удаления QR-кода' });
  }
});

app.post('/qrcodes/rename', requireLogin, async (req, res) => {
  console.log("Received rename request"); // Добавляем логирование

  try {
      const { qrId, title } = req.body;
      const email = req.session.user.email;

      // Добавь здесь свою функцию обновления в БД
      await updateQrCodeTitle(qrId, title, email);

      res.status(200).json({ message: 'Название обновлено' });
  } catch (err) {
      console.error("Rename error:", err); // Добавляем логирование ошибки
      res.status(500).json({ message: 'Ошибка при переименовании QR-кода' });
  }
});

// Отдача HTML
app.get('/qr-generator', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'qr-generator.html'));
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка при выходе' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Вы вышли' });
  });
});

// Запуск сервера
app.listen(port, () => {
  console.log(`🚀 Server is running at http://localhost:${port}`);
});


