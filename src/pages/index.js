import React, { useEffect } from 'react'
import Layout from '@/components/layout/layout'
import { Container } from 'react-bootstrap'
import { MultiStepForm } from '../components/forms/multi-step-form'
import { formSchema } from '../pages/data/formSchema'

import { useRouter } from 'next/router'

export default function Home() {
    const router = useRouter()

    useEffect(() => {
        document.title = 'Home'
        document.documentElement.lang = 'en'
    }, [])

    const handleSubmit = (data) => {
        console.log(
            'Form submitted:',
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
                    <MultiStepForm
                        onSubmit={handleSubmit}
                        formSchema={formSchema}
                    />
                </div>
            </Container>
        </Layout>
    )
}
