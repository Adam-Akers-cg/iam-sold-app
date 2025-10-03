import { useState, useMemo } from 'react'
import { Form, Button, Card, Container } from 'react-bootstrap'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import style from './multi-step-form.module.scss'
import { DynamicField } from '@/components/forms/dynamic-fields'
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs'

export const MultiStepForm = ({ onSubmit, formSchema }) => {
    const [step, setStep] = useState(0)
    const [direction, setDirection] = useState(1)
    const [formData, setFormData] = useState(initializeFormData(formSchema))
    const [formErrors, setFormErrors] = useState({})

    // Initialize form data based on the schema
    function initializeFormData(schema) {
        return Object.fromEntries(
            schema.flatMap((step) =>
                step.fields.map((field) => [field.name, '']),
            ),
        )
    }

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        setFormErrors((prev) => ({ ...prev, [name]: '' })) // Clear error on change
    }

    // Validate the current step
    const validateStep = () => {
        const errors = {}
        const currentStep = formSchema[step]
        currentStep.fields.forEach((field) => {
            if (field.validation && !field.validation(formData[field.name])) {
                errors[field.name] = field.message || 'Invalid input'
            }
        })
        setFormErrors(errors)
        return Object.keys(errors).length === 0
    }

    // Navigate to the next step
    const nextStep = () => {
        if (validateStep()) {
            setDirection(1)
            setStep((prev) => Math.min(prev + 1, formSchema.length - 1))
        }
    }

    // Navigate to the previous step
    const prevStep = () => {
        setDirection(-1)
        setStep((prev) => Math.max(prev - 1, 0))
    }

    // Reset the form
    const resetForm = () => {
        setDirection(-1)
        setFormData(initializeFormData(formSchema))
        setFormErrors({})
        setStep(0)
    }

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        if (validateStep() && onSubmit) {
            onSubmit(formData)
        }
    }

    // Optimize the renderStepContent function by memoizing the result to avoid unnecessary re-renders
    const renderStepContent = useMemo(() => {
        const currentStep = formSchema[step]
        if (currentStep.fields.length > 0) {
            return currentStep.fields.map((field, index) => (
                <DynamicField
                    key={index}
                    field={field}
                    value={formData[field.name]}
                    error={formErrors[field.name]}
                    onChange={handleChange}
                />
            ))
        } else {
            return (
                <>
                    <h5>Please confirm your answers:</h5>
                    <ul>
                        {Object.entries(formData)
                            .filter(([key]) => key !== 'undefined') // Exclude undefined keys
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
        }
    }, [formSchema, step, formData, formErrors])

    // Render step indicators
    const renderStepIndicators = () => (
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
    )

    return (
        <Container className="p-0 mb-5">
            <h2 className="mb-4">{formSchema[step].title}</h2>
            <p className="mb-4">{formSchema[step].description}</p>
            {/* Step Indicators */}
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
