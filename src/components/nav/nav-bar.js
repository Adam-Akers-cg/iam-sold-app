import { Navbar, Nav, Container, Image, Button } from 'react-bootstrap'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import style from './nav-bar.module.scss'
import OffCanvasForm from '@/components/offCanvas/offCanvas-form'
import { BsGearFill, BsFillHouseDoorFill } from 'react-icons/bs'

import React, { useMemo, useState } from 'react'

const NavigationBar = () => {
    const router = useRouter()
    const [showCanvasForm, setShowCanvasForm] = useState(false)

    return (
        <Navbar
            bg="white"
            variant="light"
            expand="lg"
            className={clsx(style['custom-nav-bar'], 'mt-0 mb-0 pt-3 pb-3')}
        >
            <Container>
                <Navbar.Brand href="/">
                    <Image
                        src="/logos/CG_M.png"
                        width="auto"
                        height="60"
                        className="d-inline-block align-top"
                        alt="React Bootstrap logo"
                    />
                </Navbar.Brand>
                <h2>
                    <BsFillHouseDoorFill
                        className={clsx(style['custom-nav-icon'])}
                    />
                    MoveMatch
                </h2>

                <Navbar.Collapse id="basic-navbar-nav">
                    <Button
                        onClick={() => setShowCanvasForm(true)}
                        style={{ float: 'right', marginLeft: 'auto' }}
                    >
                        <BsGearFill
                            style={{
                                marginBottom: '1px',
                                width: '25px',
                                height: '25px',
                            }}
                        />
                    </Button>
                </Navbar.Collapse>
            </Container>
            <OffCanvasForm
                show={showCanvasForm}
                onHide={() => setShowCanvasForm(false)}
                placement="start"
                jsonPath="settings"
                scroll={true}
                backdrop={true}
                title="Form Settings"
            ></OffCanvasForm>
        </Navbar>
    )
}

export default NavigationBar
