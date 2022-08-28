import expressSession, {MemoryStore} from 'express-session';

const initSessions = () =>
  expressSession({
    secret: process.env.SESSION_SECRET || '4f2a2eb9e320b6ce4c',
    resave: true,
    saveUninitialized: true,
    cookie: {secure: false, httpOnly: true, maxAge: 3600000},
    store: new MemoryStore(),
  });

const session = initSessions();
export default session;
