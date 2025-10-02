import { Form } from 'react-bootstrap'

export const CheckboxGroup = ({
    label,
    name,
    options = [],
    value = [],
    onChange,
    error,
}) => {
    const handleChange = (e) => {
        const { checked, value: val } = e.target
        const updated = checked
            ? [...value, val]
            : value.filter((v) => v !== val)
        onChange({ target: { name, value: updated } })
    }

    return (
        <Form.Group className="mb-3">
            <Form.Label>{label}</Form.Label>
            {options.map((option) => (
                <Form.Check
                    key={option.value}
                    type="checkbox"
                    label={option.label}
                    name={name}
                    id={`${name}-${option.value}`}
                    value={option.value}
                    checked={value.includes(option.value)}
                    onChange={handleChange}
                    isInvalid={!!error}
                />
            ))}
            {error && (
                <Form.Control.Feedback
                    type="invalid"
                    style={{ display: 'block' }}
                >
                    {error}
                </Form.Control.Feedback>
            )}
        </Form.Group>
    )
}
