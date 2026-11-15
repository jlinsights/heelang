import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  safelist: [
    // 동적으로 생성되는 클래스들을 보호
    'animate-brush-in',
    'animate-ink-drop', 
    'animate-paper-fold',
    'animate-zen-float',
    'text-ink',
    'text-ink-light',
    'text-ink-lighter',
    'text-ink-dark',
    'bg-paper',
    'bg-paper-warm',
    'bg-paper-cream',
    'bg-paper-aged',
    'bg-stone',
    'bg-stone-light',
    'bg-stone-dark',
    'text-brush',
    'text-brush-light',
    'text-brush-dark',
    'text-gold',
    'text-gold-light',
    'text-gold-dark',
    'bg-gold',
    'bg-gold-light',
    'bg-gold-dark',
    'bg-gradient-ink',
    'bg-gradient-paper',
    'bg-gradient-zen',
    'btn-art',
    'btn-art-outline',
    'btn-art-ghost',
    'card-art',
    'card-art-elevated'
  ],
  theme: {
    extend: {
      // 손가락으로 누르는 기기(pointer: coarse)에서만 누르는 면적을 44px 로 키운다
      screens: { touch: { raw: '(pointer: coarse)' } },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
  			ink: {
  				DEFAULT: 'hsl(var(--ink))',
  				light: 'hsl(var(--ink-light))',
  				lighter: 'hsl(var(--ink-lighter))',
  				dark: 'hsl(var(--ink-dark))'
  			},
  			paper: {
  				DEFAULT: 'hsl(var(--paper))',
  				warm: 'hsl(var(--paper-warm))',
  				cream: 'hsl(var(--paper-cream))',
  				aged: 'hsl(var(--paper-aged))'
  			},
  			brush: {
  				DEFAULT: 'hsl(var(--brush))',
  				light: 'hsl(var(--brush-light))',
  				dark: 'hsl(var(--brush-dark))'
  			},
  			stone: {
  				DEFAULT: 'hsl(var(--stone))',
  				light: 'hsl(var(--stone-light))',
  				dark: 'hsl(var(--stone-dark))'
  			},
  			gold: {
  				DEFAULT: 'hsl(var(--gold))',
  				light: 'hsl(var(--gold-light))',
  				dark: 'hsl(var(--gold-dark))'
  			}
  		},
  		fontFamily: {
  			display: ['var(--font-noto-serif-kr)', 'Noto Serif KR', 'serif'],
  			body: ['Apple SD Gothic Neo', 'Noto Sans KR', 'Noto Sans CJK KR', 'Malgun Gothic', 'system-ui', 'sans-serif'],
  			mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  			calligraphy: ['var(--font-noto-serif-kr)', 'Noto Serif KR', 'serif']
  		},
  		fontSize: {
  			'xs': ['0.8125rem', { lineHeight: '1.55' }],
  			'sm': ['0.875rem', { lineHeight: '1.6' }],
  			'base': ['1rem', { lineHeight: '1.7' }],
  			'lg': ['1.125rem', { lineHeight: '1.7' }],
  			'xl': ['1.25rem', { lineHeight: '1.7' }],
  			'2xl': ['1.5rem', { lineHeight: '1.6' }],
  			'3xl': ['1.875rem', { lineHeight: '1.5' }],
  			'4xl': ['2.25rem', { lineHeight: '1.4' }],
  			'5xl': ['3rem', { lineHeight: '1.3' }],
  			'6xl': ['3.75rem', { lineHeight: '1.2' }],
  			'7xl': ['4.5rem', { lineHeight: '1.1' }],
  			'8xl': ['6rem', { lineHeight: '1' }],
  			'9xl': ['8rem', { lineHeight: '1' }]
  		},
  		spacing: {
  			'18': '4.5rem',
  			'88': '22rem',
  			'128': '32rem',
  			'144': '36rem'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
  			'4xl': '2rem',
  			'5xl': '2.5rem'
  		},
  		backdropBlur: {
  			xs: '2px',
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.8s ease-out forwards',
      },
      keyframes: {
  			fadeIn: {
  				'0%': { opacity: '0', transform: 'translateY(20px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			}
  		},
  		boxShadow: {
  			'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
  			'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
  			'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 50px -10px rgba(0, 0, 0, 0.1)',
  			'ink': '0 4px 20px -2px rgba(0, 0, 0, 0.25)',
  			'paper': '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
  			'glow': '0 0 20px rgba(255, 255, 255, 0.1)',
  			'glow-strong': '0 0 40px rgba(255, 255, 255, 0.2)'
  		},
  		transitionDuration: {
  			'2000': '2000ms',
  			'3000': '3000ms',
  			'4000': '4000ms',
  			'5000': '5000ms'
  		},
  		transitionTimingFunction: {
  			'brush': 'cubic-bezier(0.4, 0, 0.2, 1)',
  			'ink': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  			'zen': 'cubic-bezier(0.23, 1, 0.32, 1)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
  corePlugins: {
    // 사용하지 않는 기본 플러그인 비활성화로 번들 크기 최적화
    float: false,
    clear: false,
    skew: false,
  },
  experimental: {
    // 최적화 실험적 기능
    optimizeUniversalDefaults: true,
  },
};
export default config;
