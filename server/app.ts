import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cors from 'cors';
import passport from './configs/passport.config.js';
import apiRouter from './apis/api.routes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import BetterSqlite3StoreFactory from 'better-sqlite3-session-store';
import Database from 'better-sqlite3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

if (process.env.NODE_ENV === 'development') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BetterSqlite3Store = BetterSqlite3StoreFactory(session);
const sessionDbPath = process.env.NODE_ENV === 'production' 
  ? '/app/data/sessions.db' 
  : './prisma/sessions.db';
const sessionDb = new Database(sessionDbPath);

app.use(
  session({
    store: new BetterSqlite3Store({
      client: sessionDb,
      expired: {
        clear: true,
        intervalMs: 1000 * 60 * 15,
      },
    }),
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

const swaggerDocumentPath = path.join(__dirname, 'apis', 'api.openapi.yml');
app.use('/api-docs', swaggerUi.serve, (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const swaggerDocument = YAML.load(swaggerDocumentPath);
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: undefined,
    },
  })(req, res, next);
});

app.use('/api', apiRouter);

const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.use((req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

export default app;
