'use client'

import { Offcanvas, Spinner, Alert } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function CustomOffCanvas({
    show,
    onHide,
    title = 'Menu',
    placement = 'start',
    scroll = false,
    backdrop = true,
    jsonPath = null, // NEW PROP
}) {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Fetch JSON when component mounts or jsonPath changes
    useEffect(() => {
        if (jsonPath && show) {
            setLoading(true)
            setError(null)
            fetch(jsonPath)
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to fetch data')
                    return res.json()
                })
                .then(setData)
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false))
        }
    }, [jsonPath, show])

    const variants = {
        hidden: {
            x:
                placement === 'start'
                    ? '-100%'
                    : placement === 'end'
                      ? '100%'
                      : 0,
            y:
                placement === 'top'
                    ? '-100%'
                    : placement === 'bottom'
                      ? '100%'
                      : 0,
            opacity: 0,
        },
        visible: {
            x: 0,
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 300, damping: 30 },
        },
        exit: {
            x:
                placement === 'start'
                    ? '-100%'
                    : placement === 'end'
                      ? '100%'
                      : 0,
            y:
                placement === 'top'
                    ? '-100%'
                    : placement === 'bottom'
                      ? '100%'
                      : 0,
            opacity: 0,
            transition: { duration: 0.3 },
        },
    }

    return (
        <AnimatePresence>
            {show && (
                <Offcanvas
                    show={show}
                    onHide={onHide}
                    placement={placement}
                    scroll={scroll}
                    backdrop={backdrop}
                    style={{ overflow: 'hidden' }}
                >
                    <motion.div
                        className="h-100"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={variants}
                    >
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>{title}</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body
                            style={{
                                overflowY: 'auto',
                                maxHeight: 'calc(100vh - 56px)',
                            }}
                        >
                            {loading && (
                                <Spinner animation="border" role="status" />
                            )}
                            {error && <Alert variant="danger">{error}</Alert>}

                            {data && Array.isArray(data) && (
                                <div>
                                    {data.map((item, index) => (
                                        <div
                                            key={index}
                                            className="mb-3 p-3 border rounded shadow-sm bg-light"
                                        >
                                            <h5 className="mb-1">
                                                {item.term}
                                            </h5>
                                            <p className="mb-0 text-muted">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Offcanvas.Body>
                    </motion.div>
                </Offcanvas>
            )}
        </AnimatePresence>
    )
}
