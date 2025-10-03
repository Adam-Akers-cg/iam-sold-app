import React, { useEffect, useState } from 'react'
import Layout from '@/components/layout/layout'
import { Container } from 'react-bootstrap'
import { MultiStepForm } from '../components/forms/multi-step-form'
import RecommendationCards from '../components/forms/form-results'
import { formSchema } from '../pages/data/formSchema'
import { scoreSchema } from '../pages/data/scoreSchema'
import { introSchema } from '../pages/data/introSchema'
import Intro from '../components/intro/intro'

import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter()
    const [hideShow, setHideShow] = useState(true)
    const [introHide, setIntroHide] = useState(false)
    const [formResults, setFormResults] = useState()

    useEffect(() => {
        document.title = 'Home'
        document.documentElement.lang = 'en'
    }, [])

    const handleSubmit = (data) => {
        setHideShow(false)
        setFormResults(
            JSON.stringify(
                Object.entries(data).filter(([key]) => key !== 'undefined'),
                null,
                2,
            ),
        )
    }

    return (
        <Layout>
            <Container>
                <div className="my-5">
                    {!introHide ? (
                        <Intro
                            introSchema={introSchema}
                            setIntroHide={() => setIntroHide(true)}
                        />
                    ) : hideShow ? (
                        <MultiStepForm
                            onSubmit={handleSubmit}
                            formSchema={formSchema}
                        />
                    ) : (
                        <div className="text-center">
                            <h3>Thank you for your submission!</h3>
                            <p>
                                We appreciate your time and effort in completing
                                the form. here are your results:
                            </p>
                            <RecommendationCards
                                answers={formResults}
                                formSchema={scoreSchema}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={() => router.reload()}
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
