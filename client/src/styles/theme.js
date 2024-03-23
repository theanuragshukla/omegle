import { extendTheme } from '@chakra-ui/react';
import 'typeface-poppins';

const theme = extendTheme({
  fontFamily: {
    sans: "'Poppins', sans-serif",
  },
  fonts: {
    html: 'Poppins, sans-serif',
    heading: 'Poppins, sans-serif',
  },
  styles: {
    global: {
      body: { fontFamily: 'Poppins, sans-serif' },
      '::-webkit-scrollbar': {
        width: '0px',
        height: '0px',
        backgroundColor: 'transparent',
      },
      '::-webkit-scrollbar-thumb': {
        backgroundColor: '#134074',
        borderRadius: '100px',
        '&:hover': {
          backgroundColor: '#4A5568',
        },
      },
    },
  },
  colors: {
    primary: '#134074',
    white: '#ffffff',
    secondary: '#C2C0FF',
    icon: '#C0C0C0',
    background: '#f5f5fa',
    background2: '#F8F9FA',
    background3: '#FAF9FF',
    backgroundMobile: '#f1f1f6',
    cardIcon: '#CCCCCC',
    amount: {
      bg: 'rgba(192, 192, 192, 0.2)',
      color: '#000000',
    },
    brand: {
      100: '#3584de',
      200: '#2479db',
      300: '#1b5ca7',
      400: '#164983',
      500: '#134074',
      600: '#103560',
      700: '#0d2c4f',
      800: '#0a223d',
      900: '#07182c',
    },
    heading: '#212121',
    text: '#949494',
    link: '#7271FF',
    success: {
      bgColor: 'rgba(176, 238, 211, 0.88)',
      color: 'rgba(26, 174, 111, 0.78)',
    },
    pending: {
      bgColor: 'rgba(255, 238, 238, 0.88)',
      color: 'rgba(255, 55, 9, 0.78)',
    },
    customers: {
      key: '#777777',
      value: '#666666',
    },
  },
  components: {
    GridItem: {
      baseStyle: {
        alignSelf: 'center',
      },
    },
    Table: {
      variants: {
        mytable: {
          tr: {
            color: 'gray.600',
            height: '52px',
            _odd: {
              background: '#faf9ff',
            },
            _even: {
              background: '#ffffff',
            },
            '& Th': {
              fontWeight: 700,
              color: 'gray.600',
              background: 'white',
              fontSize: '13px',
            },
          },
          td: {
            color: 'gray.700',
            fontWeight: 500,
            fontSize: '14px',
            height: '52px',
          },
        },
        transactionsTable: {
          tr: {
            color: 'gray.600',
            _odd: {
              background: '#faf9ff',
            },
            _even: {
              background: '#ffffff',
            },
            '& Th': {
              fontWeight: 700,
              color: 'gray.600',
              background: 'white',
              fontSize: '12px',
            },
          },
          td: {
            color: 'gray.700',
            fontWeight: 500,
            fontSize: '12px',
          },
        },
      },
    },

    heading: {
      baseStyle: {
        fontWeight: '600',
        color: '#212121',
      },
    },
    Text: {
      baseStyle: {
        fontWeight: '500',
        color: '#949494',
        whiteSpace: 'pre-line',
        fontSize: '1rem',
      },
    },
    Link: {
      baseStyle: {
        fontWeight: '600',
        color: '#7271FF',
        fontSize: '0.8rem',
        textDecoration: 'underline',
      },
    },
    Input: {
      baseStyle: {
        border: '4px solid #949494',
      },
    },
    Button: {
      baseStyle: {
        color: '#ffffff',
      },
    },
  },
});

export default theme;
