import React, { useEffect, useState, useCallback } from 'react'
import Layout from '@/components/layout/layout'
import { Container } from 'react-bootstrap'
import { MultiStepForm } from '../components/forms/multi-step-form'
import RecommendationCards from '../components/forms/form-results'
import { formSchema } from '../pages/data/formSchema'
import { scoreSchema } from '../pages/data/scoreSchema'
import { introSchema } from '../pages/data/introSchema'
import Intro from '../components/intro/intro'

export default function Home() {
    const [showForm, setShowForm] = useState(true)
    const [showIntro, setShowIntro] = useState(true)
    const [formResults, setFormResults] = useState(null)

    useEffect(() => {
        document.title = 'Home'
        document.documentElement.lang = 'en'
    }, [])

    const handleFormSubmit = useCallback(({ id, data }) => {
        setShowForm(false)
        setFormResults(
            Object.entries(data).filter(
                ([key, value]) =>
                    key !== 'undefined' && value !== undefined && value !== '',
            ),
        )
    }, [])

    const handleReStart = useCallback(() => {
        localStorage.removeItem('IamSoldApp:formScoreAdjustments')
        setShowForm(true)
        setFormResults(null)
        setShowIntro(true)
    }, [])

    return (
        <Layout introHide={showIntro}>
            <Container>
                <div className="my-5">
                    {showIntro ? (
                        <Intro
                            introSchema={introSchema}
                            setIntroHide={() => setShowIntro(false)}
                        />
                    ) : showForm ? (
                        <MultiStepForm
                            formId="moveMatchForm"
                            onSubmit={handleFormSubmit}
                            formSchema={formSchema}
                        />
                    ) : (
                        <div className="text-center">
                            <h3>Thank you for your submission!</h3>
                            <p>
                                We appreciate your time and effort in completing
                                the form. Here are your results:
                            </p>
                            <RecommendationCards
                                answers={formResults}
                                formSchema={scoreSchema}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleReStart}
                            >
                                Start another submission
                            </button>
                        </div>
                    )}
                </div>
            </Container>
        </Layout>
    )
}
// --- End component code ---
