import React from 'react'
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
        // try case-insensitive match for the question key
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

    // Build results from totals
    let results = scoreTypes.map((label, idx) => ({
        label,
        total: totals[idx],
        reasons: Array.from(reasonBuckets[idx]),
    }))

    // Sort descending
    results.sort((a, b) => b.total - a.total || a.label.localeCompare(b.label))

    // If tie for top two, attempt tie-breaker
    if (results.length >= 2 && results[0].total === results[1].total) {
        const tieCfg = schemaRoot?.defaultSettings?.[0]?.tieBreaker
        if (tieCfg && tieCfg.question && tieCfg.answers) {
            // find the submitted answer for the tie question
            const tieQuestionKey =
                findKeyCaseInsensitive(questionsObj, tieCfg.question) ||
                tieCfg.question
            // find in normalized answers (case-insensitive)
            const foundPair = normalized.find(([qn]) => {
                if (!qn) return false
                return (
                    String(qn).toLowerCase() ===
                    String(tieQuestionKey).toLowerCase()
                )
            })

            if (foundPair) {
                const submittedAnswer = foundPair[1]
                // find the answer key in the question node (case-insensitive)
                const questionNode =
                    questionsObj[tieQuestionKey] ||
                    questionsObj[
                        findKeyCaseInsensitive(questionsObj, tieQuestionKey)
                    ]
                let submittedAnswerKey = null
                if (questionNode) {
                    submittedAnswerKey =
                        findKeyCaseInsensitive(questionNode, submittedAnswer) ||
                        submittedAnswer
                } else {
                    submittedAnswerKey = submittedAnswer
                }

                // lookup mapped scoreType name from tieCfg
                const mappedScoreTypeName =
                    tieCfg.answers?.[submittedAnswerKey] ||
                    tieCfg.answers?.[String(submittedAnswerKey)]
                if (mappedScoreTypeName) {
                    // find index of the scoreType to bump
                    const bumpIndex = scoreTypes.findIndex(
                        (st) =>
                            String(st).toLowerCase() ===
                            String(mappedScoreTypeName).toLowerCase(),
                    )
                    if (bumpIndex >= 0) {
                        // apply +1 bump
                        totals[bumpIndex] = (totals[bumpIndex] || 0) + 1
                        // update reason bucket to note tie-breaker (optional)
                        reasonBuckets[bumpIndex].add(
                            `Tie-breaker: +1 for ${mappedScoreTypeName} (based on ${tieCfg.question}=${submittedAnswerKey})`,
                        )
                        // rebuild and re-sort results after bump
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
        } // else no tieBreaker configured — do nothing
    }

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

    return (
        <div>
            {/* Pills row */}
            <div id="recommendations">
                <PillResults results={answerPills} />

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
