import React from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null,
            errorId: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        const errorId = Date.now().toString();
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        
        this.setState({
            error: error,
            errorInfo: errorInfo,
            errorId: errorId
        });

        // 发送错误报告到服务器（可选）
        this.reportError(error, errorInfo, errorId);
    }

    reportError = async (error, errorInfo, errorId) => {
        try {
            await fetch('/api/error-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    errorId,
                    message: error.message,
                    stack: error.stack,
                    componentStack: errorInfo.componentStack,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    url: window.location.href
                })
            });
        } catch (reportError) {
            console.error('Failed to report error:', reportError);
        }
    };

    handleReload = () => {
        this.setState({ 
            hasError: false, 
            error: null, 
            errorInfo: null,
            errorId: null
        });
    };

    handleRefresh = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <div className="error-background">
                        <div className="floating-orb orb-1"></div>
                        <div className="floating-orb orb-2"></div>
                        <div className="gradient-overlay"></div>
                    </div>

                    <div className="error-content">
                        <div className="error-glass">
                            <div className="error-icon">
                                <div className="icon-glow">
                                    <span>😔</span>
                                </div>
                            </div>

                            <div className="error-text">
                                <h1 className="error-title">哎呀，出现了一些问题</h1>
                                <p className="error-subtitle">
                                    我们的心理支持服务遇到了技术问题，但请不要担心，这不是你的错。
                                </p>
                                
                                {this.state.error && (
                                    <div className="error-details">
                                        <details className="error-technical">
                                            <summary>技术详情 (可选查看)</summary>
                                            <div className="error-info">
                                                <p><strong>错误信息:</strong> {this.state.error.message}</p>
                                                <p><strong>错误ID:</strong> {this.state.errorId}</p>
                                                {process.env.NODE_ENV === 'development' && (
                                                    <pre className="error-stack">
                                                        {this.state.error.stack}
                                                    </pre>
                                                )}
                                            </div>
                                        </details>
                                    </div>
                                )}
                            </div>

                            <div className="error-actions">
                                <button 
                                    className="error-button primary"
                                    onClick={this.handleReload}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <polyline points="23,4 23,10 17,10"></polyline>
                                        <polyline points="1,20 1,14 7,14"></polyline>
                                        <path d="M20.49,9A9,9,0,0,0,5.64,5.64L1,10m22,4L18.36,18.36A9,9,0,0,1,3.51,15"></path>
                                    </svg>
                                    重新尝试
                                </button>
                                
                                <button 
                                    className="error-button secondary"
                                    onClick={this.handleRefresh}
                                >
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                                        <path d="M21 3v5h-5"></path>
                                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                                        <path d="M3 21v-5h5"></path>
                                    </svg>
                                    刷新页面
                                </button>
                            </div>

                            <div className="error-support">
                                <div className="support-message">
                                    <p>
                                        <strong>需要帮助？</strong>
                                    </p>
                                    <p>
                                        如果问题持续存在，你可以：
                                    </p>
                                    <ul>
                                        <li>尝试清除浏览器缓存后重新访问</li>
                                        <li>使用其他浏览器访问</li>
                                        <li>联系我们的技术支持团队</li>
                                    </ul>
                                </div>

                                <div className="emergency-notice">
                                    <div className="notice-icon">🆘</div>
                                    <div className="notice-text">
                                        <strong>紧急情况提醒：</strong>
                                        如果你正在经历心理健康危机，请立即拨打心理危机热线：400-161-9995
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
