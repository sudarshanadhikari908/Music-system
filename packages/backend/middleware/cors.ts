import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow: boolean) => void) => {
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigin = /^http:\/\/localhost:5173$/;
    if (allowedOrigin.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default cors(corsOptions);
