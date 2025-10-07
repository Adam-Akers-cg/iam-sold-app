import { useState, useEffect } from 'react'
import { Offcanvas, Spinner, Alert } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { MultiStepForm } from '@/components/forms/multi-step-form'

// ✅ Moved outside component for testability
export const schemaMap = {
    standard: () => import('@/pages/data/formSchema.js'),
    settings: () => import('@/pages/data/formSchema-settings.js'),
    // Add more schemas here
}

export default function OffCanvasForm({
    show,
    onHide,
    title = 'Menu',
    placement = 'start',
    scroll = false,
    backdrop = true,
    jsonPath = null,
}) {
    const [schema, setSchema] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!jsonPath || !schemaMap[jsonPath]) return
        setLoading(true)
        setError(null)

        schemaMap[jsonPath]()
            .then((mod) => {
                setSchema(mod.formSchema)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Failed to load schema:', err)
                setError('Failed to load form schema.')
                setLoading(false)
            })
    }, [jsonPath])

    const handleSubmitSettings = ({ id, data }) => {
        console.log(
            Object.entries(data).filter(
                ([key, value]) =>
                    key !== 'undefined' && value !== undefined && value !== '',
            ),
        )
    }

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
                            {loading && <Spinner animation="border" />}
                            {error && <Alert variant="danger">{error}</Alert>}
                            {schema && (
                                <MultiStepForm
                                    formId="formSettings"
                                    onSubmit={handleSubmitSettings}
                                    formSchema={schema}
                                />
                            )}
                        </Offcanvas.Body>
                    </motion.div>
                </Offcanvas>
            )}
        </AnimatePresence>
    )
}
