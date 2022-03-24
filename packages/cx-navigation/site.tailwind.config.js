module.exports = {
  purge: [
    './lib/**/!(*.d).{ts,js,jsx,tsx}',
  ],
  theme: {
    backdropBlur: {
      'm-md': '10px',
    },
    backdropBrightness: {
      80: '.8',
    },
    colors: {
      // Equals to #707070 with minimum opacity.
      'gray-112-10': 'rgba(112, 112, 112, .1)',
    },
    maxWidth: {
      48: '12rem',
      56: '14rem',
    }
  },
  variants: {
    borderWidth: ['first', 'last', 'responsive'],
    margin: ['first', 'last', 'responsive'],
    overflow: ['focus', 'hover', 'responsive'],
    position: ['focus', 'hover', 'responsive'],
    padding: ['first', 'last', 'responsive'],
  },
};
