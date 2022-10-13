const express = require('express');
const cors = require('cors');
const bp = require('body-parser');
const mongoose = require('mongoose');
const { config } = require('dotenv');
const cookieParser = require('cookie-parser');
const coursesRoutes = require('./routes/curses/index');
const cardRouter = require('./routes/card/index');
const ordersRoutes = require('./routes/orders/index');
const authRouter = require('./routes/auth/index');
const profileRouter = require('./routes/profile/index');
const authErrorMiddleware = require('./middleware/error.middleweare.auth');

const MONGODB_URI = config().parsed.MONGODB_URI;

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.use(authErrorMiddleware);

app.use('/courses', coursesRoutes);
app.use('/card', cardRouter);
app.use('/orders', ordersRoutes);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);

const PORT = process.env.PORT || 5000;

async function bootstrap() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
        });
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (e) {
        console.log(e);
    }
}

bootstrap();
