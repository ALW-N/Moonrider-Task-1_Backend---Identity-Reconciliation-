require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const contactRoutes = require('./routes/contactRoutes');

const app = express();
app.use(express.json());

app.use('/identify', contactRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await sequelize.authenticate();
  console.log('Database connected!');
});
