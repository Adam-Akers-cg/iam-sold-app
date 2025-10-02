export const formSchema = [
    {
        step: 0,
        title: 'Form Settings',
        fields: [
            {
                type: 'html',
                label: `<h5>Form settings</h5><p>Use the following form to set the required values</p>`,
            },
        ],
    },
    {
        step: 1,
        title: 'Form levels',
        fields: [
            {
                label: 'Assurance Level',
                name: 'assurance',
                type: 'range',
                min: 1,
                max: 10,
                step: 1,
                validation: (v) => v >= 1 && v <= 10,
                message: 'Please select a value between 1 and 10',
            },
            {
                label: 'Speed Level',
                name: 'speed',
                type: 'range',
                min: 1,
                max: 10,
                step: 1,
                validation: (v) => v >= 1 && v <= 10,
                message: 'Please select a value between 1 and 10',
            },
            {
                label: 'Price Level',
                name: 'price',
                type: 'range',
                min: 1,
                max: 10,
                step: 1,
                validation: (v) => v >= 1 && v <= 10,
                message: 'Please select a value between 1 and 10',
            },
        ],
    },
    {
        step: 2,
        title: 'Confirmation',
        fields: [],
    },
]
