// File: components/forms/NumericInput.js
import { Form } from 'react-bootstrap'

export const NumericInput = ({
    label,
    name,
    value,
    onChange,
    error,
    min,
    max,
    pattern,
    step = 1,
    ...props
}) => (
    <Form.Group className="mb-3">
        <Form.Label htmlFor={name}>{label}</Form.Label>
        <Form.Control
            id={name}
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
            min={min}
            max={max}
            step={step}
            pattern={pattern}
            {...props}
        />
        {error && (
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        )}
    </Form.Group>
)
