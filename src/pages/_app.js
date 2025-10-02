import '@/styles/globals.scss'
import { NavProvider } from '@/context/NavContext'
import NavigationBar from '@/components/nav/nav-bar'
import Footer from '@/components/footer/footer'
import React from 'react'

const AppProviders = ({ children }) => <NavProvider>{children}</NavProvider>

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong.</h1>
        }

        return this.props.children
    }
}

function MyApp({ Component, pageProps, router }) {
    const getLayout = Component.getLayout || ((page) => page)

    return (
        <ErrorBoundary>
            <AppProviders>
                <NavigationBar />

                {getLayout(<Component {...pageProps} />)}

                <Footer />
            </AppProviders>
        </ErrorBoundary>
    )
}

export default MyApp
