import { Form } from 'react-bootstrap'

export const TextArea = ({ label, name, value, onChange, error, ...props }) => (
    <Form.Group className="mb-3">
        <Form.Label htmlFor={name}>{label}</Form.Label>
        <Form.Control
            id={name}
            as="textarea"
            rows={4}
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
            {...props}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
    </Form.Group>
)
