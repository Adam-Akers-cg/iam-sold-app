// File: components/forms/RangeInput.js
import { Form } from 'react-bootstrap'

export const RangeInput = ({
    label,
    name,
    value,
    onChange,
    error,
    min = 0,
    max = 100,
    step = 1,
    ...props
}) => (
    <Form.Group className="mb-3">
        <Form.Label htmlFor={name}>
            {label}: <strong>{value}</strong>
        </Form.Label>
        <Form.Range
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            min={min}
            max={max}
            step={step}
            className={error ? 'is-invalid-range' : ''}
            {...props}
        />
        {error && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                {error}
            </Form.Control.Feedback>
        )}
    </Form.Group>
)
