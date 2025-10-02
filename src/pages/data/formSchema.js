export const formSchema = [
    {
        step: 0,
        title: 'MoveMatch',
        description: 'Tell us about yoy situation, and we will help you. ',
        fields: [
            {
                type: 'html',
                label: '<h5>Is you property vacant?</h5><p>Vacant homes can move faster through auction routes</p>',
            },
            {
                label: 'Select your option',
                name: 'vacant',
                type: 'radio',
                options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ],
                validation: (value) => value === 'yes' || value === 'no',
                message: 'Please select an option',
            },
        ],
    },
    {
        step: 1,
        title: 'MoveMatch',
        description: 'Tell us about yoy situation, and we will help you. ',
        fields: [
            {
                type: 'html',
                label: '<h5>What is the reason for your move?</h5><p>This helps balance speed, certainty and price</p>',
            },
            {
                label: 'Select your option',
                name: 'reason',
                type: 'radio',
                options: [
                    { label: 'Upsizing', value: 'upsizing' },
                    { label: 'Downsizing', value: 'downsizing' },
                    { label: 'Relocation', value: 'relocation' },
                    { label: 'Financial Reasons', value: 'financial reasons' },
                    { label: 'Probate', value: 'probate' },
                    {
                        label: 'Personal/Family Reasons',
                        value: 'personal/family reasons',
                    },
                    { label: 'Other', value: 'other' },
                ],
                validation: (value) => !!value.trim(),
                message: 'Please select an option',
            },
        ],
    },
    {
        step: 2,
        title: 'MoveMatch',
        description: 'Tell us about yoy situation, and we will help you. ',
        fields: [
            {
                type: 'html',
                label: '<h5>When would you like to have moved by?</h5><p>If you@apos;re time-pressed, auction routes may suit better.</p>',
            },
            {
                label: 'Select your option',
                name: 'period',
                type: 'radio',
                options: [
                    { label: 'ASAP (0-2 months)', value: 'asap' },
                    { label: 'Within 3 months', value: '3 months' },
                    { label: '3-6 months', value: '3-6 months' },
                    { label: 'Flexible', value: 'flexible' },
                ],
                validation: (value) => !!value.trim(),
                message: 'Please select an option',
            },
            ,
        ],
    },
    {
        step: 3,
        title: 'MoveMatch',
        description: 'Tell us about yoy situation, and we will help you. ',
        fields: [
            {
                type: 'html',
                label: '<h5>Will you have an onward purchase?</h5><p>Buying onward often changes which rout offers the best balance.</p>',
            },
            {
                label: 'Select your option',
                name: 'purchase',
                type: 'radio',
                options: [
                    { label: 'Yes', value: 'yes' },
                    { label: 'No', value: 'no' },
                ],
                validation: (value) => value === 'yes' || value === 'no',
                message: 'Please select an option',
            },
            ,
        ],
    },
    {
        step: 4,
        title: 'Confirm',
        fields: [],
    },
]
