import React from 'react'
import { Container } from 'react-bootstrap'

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column">
            <Container>
                <main>{children}</main>
            </Container>
        </div>
    )
}

export default Layout
