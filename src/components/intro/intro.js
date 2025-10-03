import React from 'react'
import { Button, Card, Container } from 'react-bootstrap'

export default function Intro({ introSchema, setIntroHide }) {
    return (
        <Container>
            <Card className="text-center">
                <Card.Body>
                    <Card.Title>{introSchema[0].title}</Card.Title>
                    <Card.Text>{introSchema[0].intro}</Card.Text>
                    <Button variant="primary" onClick={setIntroHide}>
                        Get Started
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    )
}
