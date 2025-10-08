import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
    BsHouseDoor,
    BsLightningFill,
    BsCalendar2,
    BsHouses,
} from 'react-icons/bs'
import { Container } from 'react-bootstrap'
import SaveAndPrint from '@/components/savePrint/SaveAndPrint'
import ResultCard from '@/components/card/ResultCard'
import IntroCard from '@/components/card/IntroCard'
import DebugResults from '@/components/forms/debug-results'
import PillResults from '@/components/forms/pill-results'

// --- Load default form schema, with fallback ---
let defaultFormSchema = null
try {
    const s = require('@/pages/data/scoreSchema')
    defaultFormSchema = s.scoreSchema || s.formSchema || s.default || s
} catch {
    try {
        // fallback older name

        const s2 = require('@/pages/data/scoreSchema')
        defaultFormSchema = s2.formSchema || s2.scoreSchema || s2
    } catch {
        defaultFormSchema = null
    }
}

// --- Utility: Normalize answers to [key, value] pairs ---
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
            return normalizeAnswers(JSON.parse(raw))
        } catch {
            return []
        }
    }
    if (typeof raw === 'object') return Object.entries(raw)
    if (typeof raw === 'string') {
        try {
            return normalizeAnswers(JSON.parse(raw))
        } catch {
            return []
        }
    }
    return []
}

// --- Utility: Case-insensitive key lookup ---
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
    // --- Load any saved score adjustments from localStorage ---
    const [normalizedScoreAdjustmentSaved, setNormalizedScoreAdjustmentSaved] =
        useState([])

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(
                'myApp:formScoreAdjustments',
            )
            if (raw) setNormalizedScoreAdjustmentSaved(normalizeAnswers(raw))
            console.log('Loaded score adjustments:', raw)
        } catch (err) {
            console.warn('Failed reading score adjustments', err)
            setNormalizedScoreAdjustmentSaved([])
        }
    }, [])

    // --- Schema checks ---
    if (!formSchema || !Array.isArray(formSchema) || formSchema.length === 0) {
        return (
            <div className="alert alert-warning">
                No form schema found. Pass a valid <code>formSchema</code> prop
                or place <code>scoreSchema.js</code> next to this component.
            </div>
        )
    }

    const schemaRoot = formSchema[0]
    const defaultSettings = schemaRoot?.defaultSettings?.[0] || {}
    const scoreTypes = defaultSettings.scoreTypes || []
    const questionsObj = schemaRoot?.questions?.[0] || {}
    const scoreTitle =
        defaultSettings.scoreTitle || 'Your Recommended Selling Methods'
    const scoreDescription =
        defaultSettings.scoreDescription ||
        'Based on your answers, here are the top recommended methods for selling your property. Each method is scored based on how well it aligns with your situation and preferences. The higher the score, the better the fit.'

    const normalized = normalizeAnswers(answers)

    // --- Scoring ---
    const totals = Array(scoreTypes.length).fill(0)
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

    // --- Build and sort results ---
    let results = scoreTypes.map((label, idx) => ({
        label,
        total: totals[idx],
        reasons: Array.from(reasonBuckets[idx]),
    }))
    results.sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))

    // --- settings adjustments ---

    // --- Tie-breaker logic ---
    if (results.length >= 2 && results[0].total === results[1].total) {
        const tieCfg = defaultSettings.tieBreaker
        if (tieCfg && tieCfg.question && tieCfg.answers) {
            const tieQuestionKey =
                findKeyCaseInsensitive(questionsObj, tieCfg.question) ||
                tieCfg.question
            const foundPair = normalized.find(
                ([qn]) =>
                    qn &&
                    String(qn).toLowerCase() ===
                        String(tieQuestionKey).toLowerCase(),
            )
            if (foundPair) {
                const submittedAnswer = foundPair[1]
                const questionNode =
                    questionsObj[tieQuestionKey] ||
                    questionsObj[
                        findKeyCaseInsensitive(questionsObj, tieQuestionKey)
                    ]
                const submittedAnswerKey = questionNode
                    ? findKeyCaseInsensitive(questionNode, submittedAnswer) ||
                      submittedAnswer
                    : submittedAnswer

                const mappedScoreTypeName =
                    tieCfg.answers?.[submittedAnswerKey] ||
                    tieCfg.answers?.[String(submittedAnswerKey)]
                if (mappedScoreTypeName) {
                    const bumpIndex = scoreTypes.findIndex(
                        (st) =>
                            String(st).toLowerCase() ===
                            String(mappedScoreTypeName).toLowerCase(),
                    )
                    if (bumpIndex >= 0) {
                        totals[bumpIndex] = (totals[bumpIndex] || 0) + 1
                        reasonBuckets[bumpIndex].add(
                            `Tie-breaker: +1 for ${mappedScoreTypeName} (based on ${tieCfg.question}=${submittedAnswerKey})`,
                        )
                        results = scoreTypes.map((label, idx) => ({
                            label,
                            total: totals[idx],
                            reasons: Array.from(reasonBuckets[idx]),
                        }))
                        results.sort(
                            (a, b) =>
                                b.total - a.total ||
                                a.label.localeCompare(b.label),
                        )
                    } else {
                        console.warn(
                            'Tie-breaker mapping matched a scoreType name that does not exist in scoreTypes:',
                            mappedScoreTypeName,
                        )
                    }
                } else {
                    console.warn(
                        'Tie-breaker configuration does not contain a mapping for the submitted answer:',
                        submittedAnswerKey,
                    )
                }
            } else {
                console.warn(
                    'Tie-breaker question not found in submitted answers:',
                    tieCfg.question,
                )
            }
        }
    }

    const top = results[0] || null
    const second = results[1] || null

    // --- Build pills for answers ---
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

    // --- Render ---
    return (
        <div>
            {/* Pills row */}
            <div id="recommendations">
                <PillResults results={answerPills} iconMap={iconMap} />

                <div className="mb-3">
                    <small className="text-muted">
                        Computed from {normalized.length} answers
                    </small>
                </div>

                <Container>
                    <IntroCard
                        intro={top || second}
                        scoreTitle={scoreTitle}
                        scoreDescription={scoreDescription}
                    />
                </Container>
                <Container className="d-flex gap-3 mb-4">
                    <ResultCard item={top} rank={1} />
                    <ResultCard item={second} rank={2} />
                </Container>
            </div>

            {/* Optional debug */}
            <DebugResults results={results} />

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
