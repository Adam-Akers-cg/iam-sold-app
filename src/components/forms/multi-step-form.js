import { useState, useMemo, useCallback } from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import style from './multi-step-form.module.scss'
import { DynamicField } from '@/components/forms/dynamic-fields'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'

// --- Utility: Initialize form data from schema ---
function initializeFormData(schema) {
    return Object.fromEntries(
        schema.flatMap((step) => step.fields.map((field) => [field.name, ''])),
    )
}

export const MultiStepForm = ({ onSubmit, formSchema }) => {
    const [step, setStep] = useState(0)
    const [direction, setDirection] = useState(1)
    const [formData, setFormData] = useState(() =>
        initializeFormData(formSchema),
    )
    const [formErrors, setFormErrors] = useState({})

    // Memoize current step and fields for performance
    const currentStep = useMemo(() => formSchema[step], [formSchema, step])
    const stepFields = useMemo(() => currentStep.fields || [], [currentStep])

    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }, [])

    // Validate the current step
    const validateStep = useCallback(() => {
        const errors = {}
        stepFields.forEach((field) => {
            if (field.validation && !field.validation(formData[field.name])) {
                errors[field.name] = field.message || 'Invalid input'
            }
        })
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }, [formData, stepFields])

    // Navigation handlers
    const nextStep = useCallback(() => {
        if (validateStep()) {
            setDirection(1)
            setStep((prev) => Math.min(prev + 1, formSchema.length - 1))
        }
    }, [validateStep, formSchema.length])

    const prevStep = useCallback(() => {
        setDirection(-1)
        setStep((prev) => Math.max(prev - 1, 0))
    }, [])

    // Reset the form
    const resetForm = useCallback(() => {
        setDirection(-1)
        setFormData(initializeFormData(formSchema))
        setFormErrors({})
        setStep(0)
    }, [formSchema])

    // Handle form submission
    const handleSubmit = useCallback(
        (e) => {
            e.preventDefault()
            if (validateStep() && onSubmit) {
                onSubmit(formData)
            }
        },
        [validateStep, onSubmit, formData],
    )

    // Render step content
    const renderStepContent = useMemo(() => {
        if (stepFields.length > 0) {
            return stepFields.map((field, index) => (
                <DynamicField
                    key={field.name || index}
                    field={field}
                    value={formData[field.name]}
                    error={formErrors[field.name]}
                    onChange={handleChange}
                />
            ))
        }
        // Confirmation step
        return (
            <>
                <h5>Please confirm your answers:</h5>
                <ul>
                    {Object.entries(formData)
                        .filter(([key]) => key !== 'undefined')
                        .map(([key, value]) => (
                            <li key={key}>
                                <strong>{key}:</strong>{' '}
                                {value !== undefined && value !== ''
                                    ? value
                                    : 'Not provided'}
                            </li>
                        ))}
                </ul>
            </>
        )
    }, [stepFields, formData, formErrors, handleChange])

    // Render step indicators
    const renderStepIndicators = useCallback(
        () => (
            <div className="d-flex justify-content-between align-items-center mb-5 position-relative">
                {formSchema.map((_, i) => (
                    <div
                        key={i}
                        className={clsx(
                            style['progress-bar-marker'],
                            {
                                'bg-primary text-white': step === i,
                                'bg-light': step !== i,
                            },
                            'rounded-circle border border-primary d-flex justify-content-center align-items-center',
                        )}
                    >
                        {i + 1}
                    </div>
                ))}
                {/* Progress track line */}
                <motion.div
                    className={clsx(
                        style['progress-bar'],
                        'position-absolute bg-primary',
                    )}
                    initial={{ width: 0 }}
                    animate={{
                        width: `${(step / (formSchema.length - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.5 }}
                />
                <div className={clsx(style['progress-bar-bg'])}></div>
            </div>
        ),
        [formSchema, step],
    )

    // --- Render ---
    return (
        <Container className="p-0 mb-5">
            <h2 className="mb-4">{currentStep.title}</h2>
            <p className="mb-4">{currentStep.description}</p>
            {renderStepIndicators()}

            <Form onSubmit={handleSubmit}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={`step-${step}`}
                        variants={{
                            initial: (d) => ({
                                opacity: 0,
                                x: d > 0 ? 100 : -100,
                            }),
                            animate: { opacity: 1, x: 0 },
                            exit: (d) => ({
                                opacity: 0,
                                x: d > 0 ? -100 : 100,
                            }),
                        }}
                        custom={direction}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={{ duration: 0.5 }}
                    >
                        <Card>
                            <Card.Body>{renderStepContent}</Card.Body>
                        </Card>
                    </motion.div>
                </AnimatePresence>

                <div className="d-flex justify-content-between mt-4">
                    {step > 0 ? (
                        <Button variant="secondary" onClick={prevStep}>
                            <BsChevronLeft /> Back
                        </Button>
                    ) : (
                        <span />
                    )}
                    {step < formSchema.length - 1 ? (
                        <Button onClick={nextStep}>
                            Next <BsChevronRight />
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="button"
                                variant="info"
                                onClick={resetForm}
                            >
                                Reset
                            </Button>
                            <Button
                                type="submit"
                                variant="success"
                                className="ms-2"
                            >
                                Submit
                            </Button>
                        </>
                    )}
                </div>
            </Form>
        </Container>
    )
}
