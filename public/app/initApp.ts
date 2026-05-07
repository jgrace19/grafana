// See ./index.ts for why this is in a seperate file

// Trusted types must be initialised before the rest of the world is imported
import './core/trustedTypePolicies';

// FontAwesome 4 legacy icon font (was public/sass/_grafana.scss → base/font_awesome)
import '../sass/base/_font_awesome.scss';
import app from './app';

app.init();
