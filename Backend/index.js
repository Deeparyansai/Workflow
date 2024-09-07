const express = require('express') ;
const mongoose = require('mongoose');
const cors = require('cors');
const workflowRoutes = require('./routes/workflowRoutes');
const authRoutes = require('./routes/authRoutes');


mongoose.connect('mongodb+srv://admin:deep123@cluster0.wgwii.mongodb.net/test')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const app = express() ;

app.use(cors());
app.use(express.json());
app.use('/api/workflow', workflowRoutes);
app.use('/api/auth', authRoutes);



app.listen(5000, () => console.log('Server running on port 5000'));