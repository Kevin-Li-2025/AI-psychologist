const {
  generateId,
  validatePath,
  getLanguageFromExtension,
  formatFileSize,
  debounce,
  throttle
} = require('../utils/index');

describe('Utils', () => {
  describe('generateId', () => {
    test('should generate a valid UUID', () => {
      const id = generateId();
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });
  });

  describe('validatePath', () => {
    test('should validate safe paths', () => {
      expect(validatePath('/safe/base', '/safe/base/file.txt')).toBe(true);
      expect(validatePath('/safe/base', '/safe/base/subdir/file.txt')).toBe(true);
    });

    test('should reject unsafe paths', () => {
      expect(validatePath('/safe/base', '/unsafe/file.txt')).toBe(false);
      expect(validatePath('/safe/base', '../../../etc/passwd')).toBe(false);
    });
  });

  describe('getLanguageFromExtension', () => {
    test('should return correct language for extensions', () => {
      expect(getLanguageFromExtension('.js')).toBe('javascript');
      expect(getLanguageFromExtension('.py')).toBe('python');
      expect(getLanguageFromExtension('.unknown')).toBe('plaintext');
    });
  });

  describe('formatFileSize', () => {
    test('should format file sizes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1048576)).toBe('1 MB');
    });
  });

  describe('debounce', () => {
    test('should debounce function calls', (done) => {
      let count = 0;
      const debouncedFn = debounce(() => count++, 50);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      setTimeout(() => {
        expect(count).toBe(1);
        done();
      }, 100);
    });
  });

  describe('throttle', () => {
    test('should throttle function calls', (done) => {
      let count = 0;
      const throttledFn = throttle(() => count++, 50);
      
      throttledFn();
      throttledFn();
      throttledFn();
      
      setTimeout(() => {
        expect(count).toBe(1);
        done();
      }, 100);
    });
  });
});
