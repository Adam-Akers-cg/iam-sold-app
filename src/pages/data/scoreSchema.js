export const scoreSchema = [
    {
        defaultSettings: [
            {
                scoreAdjustment: [
                    ['assurance', 'Traditional Auction'],
                    ['speed', 'Modern Method of Auction'],
                    ['price', 'Traditional Estate Agent'],
                ],
                scoreTypes: [
                    'Traditional Auction',
                    'Modern Method of Auction',
                    'Traditional Estate Agent',
                ],
                scoreTitle: 'Your Recommended Selling Methods',
                scoreDescription:
                    'Based on your answers, here are the top recommended methods for selling your property. Each method is scored based on how well it aligns with your situation and preferences. The higher the score, the better the fit.',
                tieBreaker: {
                    question: 'period',
                    answers: {
                        asap: 'Traditional Auction',
                        threeMonths: 'Modern Method of Auction',
                        sixMonths: 'Traditional Estate Agent',
                        flexible: 'Traditional Estate Agent',
                    },
                },
            },
        ],
        questions: [
            {
                vacant: {
                    yes: {
                        textAnswer: 'Yes',
                        preferred: ['Traditional Auction'],
                        reason: 'Moves faster without tenants or owners in place',
                        scores: [2, 0, 0],
                    },
                    no: {
                        textAnswer: 'No',
                        preferred: ['Modern Method of Auction'],
                        reason: 'Provides more time (~56 days), suitable when people are still living in the house',
                        scores: [0, 1, 0],
                    },
                },
                period: {
                    asap: {
                        textAnswer: 'ASAP (0-2 months)',
                        preferred: [
                            'Traditional Auction',
                            'Modern Method of Auction',
                        ],
                        reason: 'Traditional Auction is fastest (contracts exchanged on the day), Modern Method is fast + secure (~56 days)',
                        scores: [3, 2, 0],
                    },
                    threeMonths: {
                        textAnswer: 'Within 3 months',
                        preferred: [
                            'Modern Method of Auction',
                            'Traditional Estate Agent',
                        ],
                        reason: 'Modern Method works well, estate agent can also manage within this timeline',
                        scores: [0, 2, 1],
                    },
                    sixMonths: {
                        textAnswer: '3-6 months',
                        preferred: ['Traditional Estate Agent'],
                        reason: 'More time to market for the best price',
                        scores: [0, 0, 2],
                    },
                    flexible: {
                        textAnswer: 'Flexible',
                        preferred: ['Traditional Estate Agent'],
                        reason: 'Strongest choice, allows waiting for the right buyer and best price',
                        scores: [0, 0, 3],
                    },
                },
                purchase: {
                    yes: {
                        textAnswer: 'Yes',
                        preferred: [
                            'Modern Method of Auction',
                            'Traditional Estate Agent',
                        ],
                        reason: 'Better when coordinating sale and purchase together',
                        scores: [0, 2, 1],
                    },
                    no: {
                        textAnswer: 'No',
                        preferred: [
                            'Traditional Auction',
                            'Modern Method of Auction',
                        ],
                        reason: 'Auction gets a boost, simpler when no onward purchase is required',
                        scores: [1, 0, 0],
                    },
                },
                reason: {
                    upsizing: {
                        textAnswer: 'Upsizing',
                        preferred: ['Traditional Estate Agent'],
                        reason: 'Lifestyle moves often prioritise price and broad market exposure',
                        scores: [0, 0, 1],
                    },
                    downsizing: {
                        textAnswer: 'Downsizing',
                        preferred: ['Traditional Estate Agent'],
                        reason: 'Lifestyle moves often prioritise price and broad market exposure',
                        scores: [0, 0, 1],
                    },
                    Relocation: {
                        textAnswer: 'Relocation',
                        preferred: ['Modern Method of Auction'],
                        reason: 'Clear timetable helps when moving location',
                        scores: [0, 1, 0],
                    },
                    financial: {
                        textAnswer: 'Financial Reasons',
                        preferred: [
                            'Traditional Auction',
                            'Modern Method of Auction',
                        ],
                        reason: 'Quick funds + certainty, Modern Method also provides some speed and security',
                        scores: [2, 1, 0],
                    },
                    probate: {
                        textAnswer: 'Probate',
                        preferred: ['Traditional Estate Agent'],
                        reason: 'probate',
                        scores: [0, 1, 0],
                    },
                    personal: {
                        textAnswer: 'Personal/Family Reasons',
                        preferred: ['Traditional Estate Agent'],
                        reason: 'personal',
                        scores: [0, 1, 0],
                    },
                    Other: {
                        textAnswer: 'Other',
                        preferred: ['Neutral'],
                        reason: 'Does not heavily favour one path',
                        scores: [0, 0, 0],
                    },
                },
            },
        ],
    },
]
