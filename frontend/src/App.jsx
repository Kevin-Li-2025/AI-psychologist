import React, { Suspense, lazy } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

// 懒加载主要组件以提高性能
const TherapyInterface = lazy(() => import('./components/TherapyInterface'))

function App() {
  return (
    <div className="app">
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <TherapyInterface />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

export default App
