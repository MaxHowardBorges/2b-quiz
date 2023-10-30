import '@mdi/font/css/materialdesignicons.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import { createVuetify } from 'vuetify';
import { md, aliases } from 'vuetify/iconsets/md';

let defaultColors = {
  primary: '#F6C70A',
};

const lightTheme = {
  dark: false,
  colors: Object.assign({}, {}, defaultColors),
};

const darkTheme = { dark: true, colors: Object.assign({}, {}, defaultColors) };

export const vuetify = createVuetify({
  icons: {
    defaultSet: 'md',
    aliases,
    sets: {
      md,
    },
  },
  theme: {
    defaultTheme: 'lightTheme',
    variations: {
      colors: ['primary', 'secondary'],
      lighten: 1,
      darken: 2,
    },
    themes: {
      lightTheme,
      darkTheme,
    },
  },
});
