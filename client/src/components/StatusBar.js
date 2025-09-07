import React, { useState, useEffect } from 'react';
import { Badge, Typography, Space, Tooltip } from 'antd';
import { 
  WifiOutlined, 
  DatabaseOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import styled from 'styled-components';
import { socketService } from '../services/socket';

const { Text } = Typography;

const StatusBarContainer = styled.div`
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 12px;
  color: white;
  border-top: 1px solid rgba(255,255,255,0.1);
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0.9;
  
  &:hover {
    opacity: 1;
  }
`;

const StatusBadge = styled(Badge)`
  .ant-badge-dot {
    width: 6px;
    height: 6px;
  }
`;

const StatusBar = ({ currentProject, currentFile }) => {
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [projectStats, setProjectStats] = useState({ files: 0, size: 0 });

  useEffect(() => {
    // 更新时间
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 监听连接状态
    const updateConnectionStatus = () => {
      const status = socketService.getConnectionStatus();
      setConnectionStatus(status.isConnected ? 'connected' : 'disconnected');
    };

    socketService.on('connected', updateConnectionStatus);
    socketService.on('disconnected', updateConnectionStatus);
    updateConnectionStatus();

    return () => {
      clearInterval(timeInterval);
      socketService.off('connected', updateConnectionStatus);
      socketService.off('disconnected', updateConnectionStatus);
    };
  }, []);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'connecting':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      default:
        return <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '已连接';
      case 'connecting':
        return '连接中';
      default:
        return '未连接';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <StatusBarContainer>
      <Space size={16}>
        <StatusItem>
          <Tooltip title="WebSocket连接状态">
            <Space size={4}>
              {getConnectionIcon()}
              <Text style={{ color: 'white', fontSize: 12 }}>
                {getConnectionText()}
              </Text>
            </Space>
          </Tooltip>
        </StatusItem>

        {currentProject && (
          <StatusItem>
            <DatabaseOutlined />
            <Text style={{ color: 'white', fontSize: 12 }}>
              {currentProject.name}
            </Text>
          </StatusItem>
        )}

        {currentFile && (
          <StatusItem>
            <Text style={{ color: 'white', fontSize: 12 }}>
              {currentFile.name}
            </Text>
          </StatusItem>
        )}
      </Space>

      <Space size={16}>
        <StatusItem>
          <Text style={{ color: 'white', fontSize: 12 }}>
            LocalCursor v1.0.0
          </Text>
        </StatusItem>

        <StatusItem>
          <ClockCircleOutlined />
          <Text style={{ color: 'white', fontSize: 12 }}>
            {currentTime.toLocaleTimeString()}
          </Text>
        </StatusItem>
      </Space>
    </StatusBarContainer>
  );
};

export default StatusBar;
