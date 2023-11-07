import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createVuetify } from 'vuetify';
import { md, aliases } from 'vuetify/iconsets/md';

let defaultColors = {
  primary: '#F6C70A',
};

const lightTheme = {
  dark: false,
  colors: Object.assign({}, { secondary: '#212121' }, defaultColors),
};

const darkTheme = {
  dark: true,
  colors: Object.assign({}, { secondary: '#212121' }, defaultColors),
};

export const vuetify = createVuetify({
  components,
  directives,
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
      lighten: 3,
      darken: 3,
    },
    themes: {
      lightTheme,
      darkTheme,
    },
  },
});
