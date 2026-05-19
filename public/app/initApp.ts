// See ./index.ts for why this is in a seperate file

// Trusted types must be initialised before the rest of the world is imported
import './core/trustedTypePolicies';
// Font Awesome 4.x icon font + glyph rules (formerly via `public/sass/_grafana.scss`)
import './styles/legacyFontAwesome.scss';
import app from './app';

app.init();
