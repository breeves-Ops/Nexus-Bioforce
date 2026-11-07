import { Component } from 'react'

const ERROR_BOUNDARY_PREFIX = '[NEXUS_BIOFORCE_SYSTEM]'

export default class ErrorBoundary extends Component {
  constructor(e) {
    super(e)
    this.state = {
      hasError: false,
      error: null,
    }
    console.log(
      `${ERROR_BOUNDARY_PREFIX} ErrorBoundary constructed — protecting: ${e.name || 'unknown'}`,
    )
  }
  static getDerivedStateFromError(e) {
    return {
      hasError: true,
      error: e,
    }
  }
  componentDidCatch(e, t) {
    var i
    console.error(
      `${ERROR_BOUNDARY_PREFIX} ErrorBoundary caught in ${this.props.name || 'unknown'}:`,
      e,
      (i = t.componentStack) == null ? undefined : i.slice(0, 200),
    )
  }
  render() {
    if (this.state.hasError) {
      if (this.props.silent) {
        return null
      } else if (this.props.fallback) {
        return this.props.fallback
      } else {
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at 50% 30%, #001a2e 0%, #040c0a 70%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '0.75rem',
                color: 'rgba(200,168,75,0.4)',
                letterSpacing: '0.1em',
                textAlign: 'center',
              }}
            >
              WEBGL UNAVAILABLE
            </div>
          </div>
        )
      }
    } else {
      return this.props.children
    }
  }
}
