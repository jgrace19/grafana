// See ./index.ts for why this is in a seperate file

// Trusted types must be initialised before the rest of the world is imported
import './core/trustedTypePolicies';
// Legacy FontAwesome 4 stylesheet pulled in via `public/sass/fontawesome-app-import.scss`
// (replaces the removed `public/sass/_grafana.scss` chain).
import '../sass/fontawesome-app-import.scss';
import app from './app';

app.init();
