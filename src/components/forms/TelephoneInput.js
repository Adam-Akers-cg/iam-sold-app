// File: components/forms/TelephoneInput.js
import { Form } from 'react-bootstrap'

export const TelephoneInput = ({
    label,
    name,
    value,
    onChange,
    error,
    ...props
}) => (
    <Form.Group className="mb-3">
        <Form.Label htmlFor={name}>{label}</Form.Label>
        <Form.Control
            id={name}
            type="tel"
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
            placeholder="e.g. +1 234 567 8900"
            {...props}
        />
        {error && (
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        )}
    </Form.Group>
)
