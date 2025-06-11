const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.js 앱의 경로 설정
  dir: './',
})

// Jest 커스텀 설정
const customJestConfig = {
  // 테스트 환경 설정
  testEnvironment: 'jsdom',
  
  // 테스트 파일 패턴
  testMatch: [
    '**/__tests__/**/*.(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)',
  ],
  
  // 커버리지 설정
  collectCoverageFrom: [
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'app/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
  ],
  
  // 모듈 경로 별칭
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  
  // 테스트 setup 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 테스트 커버리지 임계값
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // 변환할 파일 제외
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
}

module.exports = createJestConfig(customJestConfig) 