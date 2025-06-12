import Parse from 'parse/dist/parse.min.js';

// Ensure environment variables are set in .env.local
const APP_ID = process.env.NEXT_PUBLIC_PARSE_APP_ID as string;
const JS_KEY = process.env.NEXT_PUBLIC_PARSE_JS_KEY as string;
const SERVER_URL = process.env.NEXT_PUBLIC_PARSE_SERVER_URL as string;

if (!APP_ID || !SERVER_URL) {
  // eslint-disable-next-line no-console
  console.warn('[parseClient] Parse environment variables missing. Parse SDK not initialised.');
} else {
  Parse.initialize(APP_ID, JS_KEY);
  Parse.serverURL = SERVER_URL;
}

export default Parse;