// components/Footer.js
import { Container, Row, Col, Image } from 'react-bootstrap'
import Link from 'next/link'
import clsx from 'clsx'
import style from './footer.module.scss'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-auto">
            <div className="bg-primary text-white py-3">
                <Container>
                    <Row>
                        <Col className="text-center">
                            <p className="fs-6">
                                Connells Group describes companies and brands
                                within the Connells Limited group of companies.
                                Connells Limited is registered in England and
                                Wales under company number 3187394. Registered
                                Office is Cumbria House, 16-20 Hockliffe Street,
                                Leighton Buzzard, Bedfordshire, LU7 1GN. VAT
                                Registration Number is 500 2481 05. For
                                activities relating to regulated mortgages and
                                non-investment insurance contracts, Connells
                                Limited is authorised and regulated by the
                                Financial Conduct Authority. Connells Limited’s
                                Financial Services Register number is 302221.
                            </p>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="text-center">
                            <p aria-label="Copyright">
                                &copy; {currentYear}{' '}
                                <strong>Connells Group </strong>. All Rights
                                Reserved.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </footer>
    )
}

export default Footer
