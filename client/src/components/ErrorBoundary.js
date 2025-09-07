import React from 'react';
import { Result, Button } from 'antd';
import { BugOutlined } from '@ant-design/icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          icon={<BugOutlined />}
          title="程序出现错误"
          subTitle={this.state.error && this.state.error.toString()}
          extra={
            <Button 
              type="primary" 
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            >
              重新加载
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
