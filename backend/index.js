const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

const uploadRoute = require('./routes/uploadRoute');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');

app.use('/api/receipt', uploadRoute);
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes); 
app.use('/api/budgets', budgetRoutes);

app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = 80;

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));