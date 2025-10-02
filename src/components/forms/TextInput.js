import { Form } from 'react-bootstrap'

export const TextInput = ({
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
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
            autoComplete="off"
            {...props}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
)
