import { useState, useEffect, useCallback } from 'react'
import { Offcanvas, Spinner, Alert, Button } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import { MultiStepForm } from '@/components/forms/multi-step-form'

// Schema loader map for dynamic import
export const schemaMap = {
    standard: () => import('@/pages/data/formSchema.js'),
    settings: () => import('@/pages/data/formSchema-settings.js'),
    // Add more schemas here
}

const SCORE_ADJUSTMENT_STORAGE_KEY = 'IamSoldApp:formScoreAdjustments'

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
    const [formSettingHide, setFormSettingHide] = useState(true)

    // Load schema dynamically when jsonPath changes
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

    // Handle settings form submit
    const handleSubmitSettings = useCallback(({ id, data }) => {
        setFormSettingHide(false)
        const cleaned = Object.entries(data).filter(
            ([key, value]) =>
                key !== 'undefined' && value !== undefined && value !== '',
        )
        try {
            window.localStorage.setItem(
                SCORE_ADJUSTMENT_STORAGE_KEY,
                JSON.stringify(cleaned),
            )
        } catch (err) {
            console.warn('Failed to save settings to localStorage', err)
        }
        return cleaned
    }, [])

    // Handle close
    const handleClose = useCallback(() => {
        setFormSettingHide(true)
        onHide()
    }, [onHide])

    // Animation variants
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
                    onHide={handleClose}
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
                            {schema &&
                                (formSettingHide ? (
                                    <MultiStepForm
                                        formId="formSettings"
                                        onSubmit={handleSubmitSettings}
                                        formSchema={schema}
                                    />
                                ) : (
                                    <div>
                                        <h3>Form settings saved!</h3>
                                        <Button
                                            variant="primary"
                                            onClick={handleClose}
                                        >
                                            Close
                                        </Button>
                                    </div>
                                ))}
                        </Offcanvas.Body>
                    </motion.div>
                </Offcanvas>
            )}
        </AnimatePresence>
    )
}
