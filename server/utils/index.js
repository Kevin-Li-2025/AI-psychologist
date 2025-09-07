const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');

/**
 * 生成唯一ID
 */
const generateId = () => {
  return crypto.randomUUID();
};

/**
 * 验证文件路径安全性
 */
const validatePath = (basePath, targetPath) => {
  const resolvedBase = path.resolve(basePath);
  const resolvedTarget = path.resolve(targetPath);
  
  return resolvedTarget.startsWith(resolvedBase);
};

/**
 * 获取文件扩展名对应的语言
 */
const getLanguageFromExtension = (ext) => {
  const langMap = {
    '.js': 'javascript',
    '.jsx': 'javascript', 
    '.ts': 'typescript',
    '.tsx': 'typescript',
    '.py': 'python',
    '.java': 'java',
    '.cpp': 'cpp',
    '.c': 'c',
    '.php': 'php',
    '.rb': 'ruby',
    '.go': 'go',
    '.rs': 'rust',
    '.html': 'html',
    '.css': 'css',
    '.scss': 'scss',
    '.less': 'less',
    '.json': 'json',
    '.md': 'markdown',
    '.xml': 'xml',
    '.yaml': 'yaml',
    '.yml': 'yaml',
    '.sh': 'shell',
    '.sql': 'sql'
  };
  
  return langMap[ext.toLowerCase()] || 'plaintext';
};

/**
 * 格式化文件大小
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 递归获取目录大小
 */
const getDirectorySize = async (dirPath) => {
  let totalSize = 0;
  
  try {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stats = await fs.stat(itemPath);
      
      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        totalSize += await getDirectorySize(itemPath);
      }
    }
  } catch (error) {
    console.error('Error calculating directory size:', error);
  }
  
  return totalSize;
};

/**
 * 获取文件统计信息
 */
const getFileStats = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isDirectory: stats.isDirectory(),
      isFile: stats.isFile()
    };
  } catch (error) {
    return null;
  }
};

/**
 * 深度克隆对象
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * 防抖函数
 */
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数
 */
const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 错误处理中间件
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 响应格式化
 */
const sendResponse = (res, statusCode = 200, success = true, data = null, message = null) => {
  res.status(statusCode).json({
    success,
    data,
    message,
    timestamp: new Date().toISOString()
  });
};

/**
 * 错误响应
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', details = null) => {
  res.status(statusCode).json({
    success: false,
    error: message,
    details,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  generateId,
  validatePath,
  getLanguageFromExtension,
  formatFileSize,
  getDirectorySize,
  getFileStats,
  deepClone,
  debounce,
  throttle,
  asyncHandler,
  sendResponse,
  sendError
};
