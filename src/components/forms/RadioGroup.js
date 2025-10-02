import { Form } from 'react-bootstrap'
import clsx from 'clsx'
import style from './multi-step-form.module.scss'

export const RadioGroup = ({
    label,
    name,
    options = [],
    value,
    onChange,
    error,
}) => (
    <Form.Group className={clsx(style['radio-button'])}>
        <Form.Label>{label}</Form.Label>
        {options.map((option) => (
            <Form.Check
                key={option.value}
                type="radio"
                label={option.label}
                name={name}
                id={`${name}-${option.value}`}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                isInvalid={!!error}
                className={clsx(style['radio-button-input'])}
            />
        ))}
        {error && (
            <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
                {error}
            </Form.Control.Feedback>
        )}
    </Form.Group>
)
