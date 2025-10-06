import React from 'react'
import { Container } from 'react-bootstrap'
import HeroImage from '../hero/hero'

const Layout = ({ children, introHide }) => {
    return (
        <div className="d-flex flex-column">
            {introHide && <HeroImage />}
            <Container>
                <main>{children}</main>
            </Container>
        </div>
    )
}

export default Layout
