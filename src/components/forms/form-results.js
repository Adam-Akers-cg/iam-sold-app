import React from 'react'
import PropTypes from 'prop-types'
import {
    BsHouseDoor,
    BsLightningFill,
    BsCalendar2,
    BsHouses,
} from 'react-icons/bs'
import clsx from 'clsx'
import style from './multi-step-form.module.scss'
import { Container } from 'react-bootstrap'
import SaveAndPrint from '@/components/savePrint/SaveAndPrint'

// --- Begin component code ---
let defaultFormSchema = null
try {
    // try to load schema file near the component
    // eslint-disable-next-line global-require
    const s = require('@/pages/data/scoreSchema')
    defaultFormSchema = s.scoreSchema || s.formSchema || s.default || s
} catch (e) {
    try {
        // fallback older name
        // eslint-disable-next-line global-require
        const s2 = require('@/pages/data/scoreSchema')
        defaultFormSchema = s2.formSchema || s2.scoreSchema || s2
    } catch (e2) {
        defaultFormSchema = null
    }
}

function normalizeAnswers(raw) {
    if (!raw) return []
    if (Array.isArray(raw)) {
        if (raw.length === 0) return []
        if (Array.isArray(raw[0])) return raw
        if (typeof raw[0] === 'object' && raw[0] !== null) {
            if (
                raw[0].hasOwnProperty('key') &&
                raw[0].hasOwnProperty('value')
            ) {
                return raw.map((r) => [r.key, r.value])
            }
            return raw.map((obj) => Object.entries(obj)[0] || [])
        }
        try {
            const parsed = JSON.parse(raw)
            return normalizeAnswers(parsed)
        } catch (e) {
            return []
        }
    }
    if (typeof raw === 'object') return Object.entries(raw)
    if (typeof raw === 'string') {
        try {
            const parsed = JSON.parse(raw)
            return normalizeAnswers(parsed)
        } catch (e) {
            return []
        }
    }
    return []
}

const findKeyCaseInsensitive = (obj, target) => {
    if (!obj || typeof obj !== 'object') return null
    const lower = String(target).toLowerCase()
    return (
        Object.keys(obj).find((k) => String(k).toLowerCase() === lower) || null
    )
}

const iconMap = {
    vacant: BsHouseDoor,
    reason: BsLightningFill,
    period: BsCalendar2,
    purchase: BsHouses,
}

export default function RecommendationCards({
    answers,
    formSchema = defaultFormSchema,
}) {
    // Basic existence check
    if (!formSchema || !Array.isArray(formSchema) || formSchema.length === 0) {
        return (
            <div className="alert alert-warning">
                No form schema found. Pass a valid <code>formSchema</code> prop
                or place <code>scoreSchema.js</code> next to this component.
            </div>
        )
    }

    const schemaRoot = formSchema[0]
    const scoreTypes = schemaRoot?.defaultSettings?.[0]?.scoreTypes || []
    const questionsObj = schemaRoot?.questions?.[0] || {}
    const scoreTitle =
        schemaRoot?.defaultSettings?.[0]?.scoreTitle ||
        'Your Recommended Selling Methods'
    const scoreDescription =
        schemaRoot?.defaultSettings?.[0]?.scoreDescription ||
        'Based on your answers, here are the top recommended methods for selling your property. Each method is scored based on how well it aligns with your situation and preferences. The higher the score, the better the fit.'

    const normalized = normalizeAnswers(answers)

    // --- scoring ---
    const totals = scoreTypes.map(() => 0)
    const reasonBuckets = scoreTypes.map(() => new Set())

    normalized.forEach(([qName, aValue]) => {
        if (!qName) return
        const qKey = findKeyCaseInsensitive(questionsObj, qName) || qName
        const question = questionsObj[qKey]
        if (!question) return
        const aKey = findKeyCaseInsensitive(question, aValue) || aValue
        const answerNode = question[aKey]
        if (!answerNode) return
        const scores = Array.isArray(answerNode.scores) ? answerNode.scores : []
        scores.forEach((s, idx) => {
            const num = Number(s) || 0
            totals[idx] += num
            if (num > 0 && answerNode.reason)
                reasonBuckets[idx].add(answerNode.reason)
        })
    })

    const results = scoreTypes.map((label, idx) => ({
        label,
        total: totals[idx],
        reasons: Array.from(reasonBuckets[idx]),
    }))
    results.sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))

    const top = results[0] || null
    const second = results[1] || null

    // build pills (uses textAnswer where available)
    const answerPills = normalized.map(([qName, aValue], i) => {
        if (!qName) return null
        const qKey = findKeyCaseInsensitive(questionsObj, qName) || qName
        const question = questionsObj[qKey]
        if (!question)
            return {
                key: `${qName}-${i}`,
                display: `${qName}: ${String(aValue)}`,
            }
        const aKey = findKeyCaseInsensitive(question, aValue) || aValue
        const answerNode = question[aKey]
        const textAnswer = answerNode?.textAnswer || String(aValue)
        return {
            key: `${qKey}-${aKey}-${i}`,
            display: textAnswer,
            qName: qKey,
            aKey,
        }
    })

    // Intro Card component

    const IntroCard = ({ intro }) => {
        if (!intro) return null
        return (
            <div
                className={clsx(
                    'card mb-3',
                    style['intro-card'],
                    'border-primary',
                )}
            >
                <div className="card-body">
                    <h5 className="card-title">{scoreTitle}</h5>
                    <p className="card-text">{scoreDescription}</p>
                </div>
            </div>
        )
    }

    // Card component
    const Card = ({ item, rank }) => {
        if (!item) return null
        return (
            <div className="card flex-fill">
                <div className="card-body">
                    <h5 className="card-title">
                        {rank}. {item.label}
                    </h5>
                    <h6 className="mb-2 fw-bold text-primary">
                        Score: {item.total}
                    </h6>
                    {item.reasons.length > 0 ? (
                        <div>
                            <strong>
                                Reason{item.reasons.length > 1 ? 's' : ''}:
                            </strong>
                            <ul className="list-group list-group-flush">
                                {item.reasons.map((r, i) => (
                                    <li className="list-group-item" key={i}>
                                        {r}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <p className="text-muted">
                            No specific reasons contributed to this result.
                        </p>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Pills row */}
            <div id="recommendations">
                <div className="mb-3">
                    <div className="d-flex flex-wrap justify-content-center">
                        {answerPills.map((p) => {
                            if (!p) return null
                            const Icon = iconMap[p.qName?.toLowerCase()]
                            return (
                                <span
                                    key={p.key}
                                    className="badge rounded-pill bg-primary text-white border fs-3 me-2 mb-2 px-3 py-2 d-flex align-items-center"
                                >
                                    {Icon && (
                                        <Icon className="me-4" size={20} />
                                    )}
                                    {p.display}
                                </span>
                            )
                        })}
                    </div>
                </div>

                <div className="mb-3">
                    <small className="text-muted">
                        Computed from {normalized.length} answers
                    </small>
                </div>

                <Container>
                    <IntroCard intro={top || second} />
                </Container>
                <Container className="d-flex gap-3 mb-4">
                    <Card item={top} rank={1} />
                    <Card item={second} rank={2} />
                </Container>
            </div>

            {/* Optional debug */}
            <details>
                <summary>Debug — full totals</summary>
                <pre>{JSON.stringify(results, null, 2)}</pre>
            </details>

            {/* Controls: Print */}
            <SaveAndPrint
                targetId="recommendations"
                filename="my-recommendations.pdf"
                options={{
                    scale: 2,
                    orientation: 'portrait',
                    format: 'a4',
                    marginTop: 15,
                }}
            >
                Save & Print
            </SaveAndPrint>
        </div>
    )
}

RecommendationCards.propTypes = {
    answers: PropTypes.any.isRequired, // we normalize many shapes
    formSchema: PropTypes.any,
}
