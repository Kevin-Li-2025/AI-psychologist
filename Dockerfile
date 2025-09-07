# 使用官方 Node.js 运行时作为基础镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production

# 复制根目录的 package.json 和 package-lock.json
COPY package*.json ./

# 安装后端依赖
RUN npm ci --only=production

# 复制客户端的 package.json
COPY client/package*.json ./client/

# 安装客户端依赖并构建
RUN cd client && npm ci --only=production && npm run build

# 复制服务器源代码
COPY server/ ./server/

# 复制客户端构建文件
COPY client/build/ ./client/build/

# 创建工作目录
RUN mkdir -p workspace

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S localcursor -u 1001

# 更改文件所有权
RUN chown -R localcursor:nodejs /app
USER localcursor

# 暴露端口
EXPOSE 3001

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => { \
    if (res.statusCode === 200) { process.exit(0); } else { process.exit(1); } \
  }).on('error', () => { process.exit(1); });"

# 启动应用
CMD ["npm", "start"]
