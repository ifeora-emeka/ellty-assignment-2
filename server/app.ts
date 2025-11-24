import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import passport from './configs/passport.config.js';
import apiRouter from './apis/api.routes.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7,
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
