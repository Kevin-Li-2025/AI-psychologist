import React from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px;
`;

const LoadingIcon = styled(LoadingOutlined)`
  font-size: 48px;
  color: #1890ff;
  animation: ${rotate} 1s linear infinite;
`;

const LoadingText = styled.div`
  margin-top: 16px;
  font-size: 16px;
  color: #666;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingDots = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #999;
  
  &::after {
    content: '';
    animation: ${pulse} 1.5s ease-in-out infinite;
  }
`;

const LoadingSpinner = ({ text = "加载中", size = "large" }) => {
  return (
    <LoadingContainer>
      <Spin 
        indicator={<LoadingIcon />} 
        size={size}
      />
      <LoadingText>{text}</LoadingText>
      <LoadingDots>请稍候...</LoadingDots>
    </LoadingContainer>
  );
};

export default LoadingSpinner;
