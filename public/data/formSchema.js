export const formSchema = [
    {
        step: 0,
        title: 'User Info',
        fields: [
            {
                type: 'html',
                label: '<h5>Before You Begin</h5><p>Please read the following instructions carefully before filling out the form.</p>',
            },
            {
                label: 'Forename',
                name: 'forename',
                type: 'text',
                validation: (value) => !!value.trim(),
                message: 'Forename is required',
            },
            {
                label: 'Surname',
                name: 'surname',
                type: 'text',
                validation: (value) => !!value.trim(),
                message: 'Surname is required',
            },
            {
                label: 'Phone Number',
                name: 'telephone',
                type: 'tel',
                pattern: '^\\+?[0-9]{7,20}$',
                validation: (v) => /^\+?[0-9]{7,20}$/.test(v),
                message: 'Please enter a valid phone number',
            },
            {
                label: 'Email',
                name: 'email',
                type: 'email',
                validation: (value) => /\S+@\S+\.\S+/.test(value),
                message: 'Invalid email address',
            },
        ],
    },
    {
        step: 1,
        title: 'Message',
        fields: [
            {
                label: 'Subject',
                name: 'subject',
                type: 'text',
                validation: (value) => !!value.trim(),
                message: 'Subject is required',
            },
            {
                label: 'Message',
                name: 'message',
                type: 'textarea',
                validation: (value) => !!value.trim(),
                message: 'Message is required',
            },
        ],
    },
    {
        step: 2,
        title: 'How did we do?',
        fields: [
            {
                label: 'How did we do? Mark us out of 10',
                name: 'satisfaction',
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
        step: 3,
        title: 'Confirm',
        fields: [],
    },
]
