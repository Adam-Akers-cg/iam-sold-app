import { Form } from 'react-bootstrap'

export const SelectInput = ({
    label,
    name,
    value,
    onChange,
    error,
    options = [],
    ...props
}) => (
    <Form.Group className="mb-3">
        <Form.Label htmlFor={name}>{label}</Form.Label>
        <Form.Select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            isInvalid={!!error}
            {...props}
        >
            <option value="">Select an option</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </Form.Select>
        {error && (
            <Form.Control.Feedback type="invalid">
                {error}
            </Form.Control.Feedback>
        )}
    </Form.Group>
)
