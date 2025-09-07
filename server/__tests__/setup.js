// 测试环境设置
process.env.NODE_ENV = 'test';
process.env.HUNYUAN_API_KEY = 'test-api-key';
process.env.HUNYUAN_BASE_URL = 'https://test-api.example.com/v1';
process.env.PORT = '3002';

// Mock console methods in tests
global.console = {
  ...console,
  // 在测试中保留错误日志
  error: jest.fn(),
  warn: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn()
};
