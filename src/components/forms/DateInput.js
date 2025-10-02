import { Form } from 'react-bootstrap'

export const DateInput = ({
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
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
            {...props}
        />
        {error && (
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        )}
    </Form.Group>
)
