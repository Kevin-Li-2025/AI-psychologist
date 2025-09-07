import React from 'react';
import { Card, Button, Row, Col, Typography, Space } from 'antd';
import { 
  RobotOutlined, 
  CodeOutlined, 
  ThunderboltOutlined, 
  FileTextOutlined,
  BulbOutlined,
  RocketOutlined
} from '@ant-design/icons';
import styled from 'styled-components';

const { Title, Paragraph } = Typography;

const WelcomeContainer = styled.div`
  padding: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WelcomeCard = styled(Card)`
  max-width: 1200px;
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  border: none;
  
  .ant-card-body {
    padding: 48px;
  }
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    border-color: #1890ff;
  }
  
  .ant-card-body {
    padding: 24px;
    text-align: center;
  }
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  
  .anticon {
    font-size: 28px;
    color: white;
  }
`;

const StatsCard = styled.div`
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  color: white;
  margin-bottom: 16px;
`;

const WelcomeScreen = ({ onCreateProject }) => {
  const features = [
    {
      icon: <RobotOutlined />,
      title: 'AI 智能助手',
      description: '基于腾讯混元大模型，提供智能代码生成、分析和优化建议'
    },
    {
      icon: <CodeOutlined />,
      title: '代码编辑器',
      description: '集成 Monaco Editor，支持多语言语法高亮和智能补全'
    },
    {
      icon: <ThunderboltOutlined />,
      title: '自主编程',
      description: 'AI 自动分析需求，生成完整项目结构和代码实现'
    },
    {
      icon: <FileTextOutlined />,
      title: '项目管理',
      description: '完整的项目创建、文件管理和版本控制功能'
    },
    {
      icon: <BulbOutlined />,
      title: '实时协作',
      description: 'WebSocket 支持的实时协作和代码同步功能'
    },
    {
      icon: <RocketOutlined />,
      title: '一键部署',
      description: '支持 Docker 容器化部署，快速上线你的项目'
    }
  ];

  return (
    <WelcomeContainer>
      <WelcomeCard>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: 80,
            height: 80,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <RobotOutlined style={{ fontSize: 36, color: 'white' }} />
          </div>
          
          <Title level={1} style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 16
          }}>
            欢迎使用 LocalCursor
          </Title>
          
          <Paragraph style={{ fontSize: 18, color: '#666', marginBottom: 32 }}>
            AI 驱动的自主编程集成开发环境，让编程变得更加智能和高效
          </Paragraph>

          <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
            <Col xs={24} sm={8}>
              <StatsCard>
                <Title level={2} style={{ color: 'white', margin: 0 }}>100+</Title>
                <div>支持语言</div>
              </StatsCard>
            </Col>
            <Col xs={24} sm={8}>
              <StatsCard style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' }}>
                <Title level={2} style={{ color: '#333', margin: 0 }}>AI</Title>
                <div style={{ color: '#333' }}>智能助手</div>
              </StatsCard>
            </Col>
            <Col xs={24} sm={8}>
              <StatsCard style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' }}>
                <Title level={2} style={{ color: '#333', margin: 0 }}>24/7</Title>
                <div style={{ color: '#333' }}>在线服务</div>
              </StatsCard>
            </Col>
          </Row>

          <Space size="large">
            <Button 
              type="primary" 
              size="large"
              onClick={onCreateProject}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              开始创建项目
            </Button>
            <Button 
              size="large"
              style={{
                borderRadius: '8px',
                height: '48px',
                padding: '0 32px',
                fontSize: '16px'
              }}
            >
              查看文档
            </Button>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={8} key={index}>
              <FeatureCard>
                <IconWrapper>
                  {feature.icon}
                </IconWrapper>
                <Title level={4} style={{ marginBottom: 12 }}>
                  {feature.title}
                </Title>
                <Paragraph style={{ color: '#666', margin: 0 }}>
                  {feature.description}
                </Paragraph>
              </FeatureCard>
            </Col>
          ))}
        </Row>

        <div style={{ 
          textAlign: 'center', 
          marginTop: 48, 
          padding: 24, 
          background: '#f8f9fa', 
          borderRadius: 12 
        }}>
          <Title level={4} style={{ marginBottom: 8 }}>
            🚀 准备好开始了吗？
          </Title>
          <Paragraph style={{ margin: 0, color: '#666' }}>
            创建你的第一个项目，体验 AI 驱动的编程魅力
          </Paragraph>
        </div>
      </WelcomeCard>
    </WelcomeContainer>
  );
};

export default WelcomeScreen;
