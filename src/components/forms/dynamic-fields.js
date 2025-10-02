import { TextInput } from '@/components/forms/TextInput'
import { TextArea } from '@/components/forms/TextArea'
import { RadioGroup } from '@/components/forms/RadioGroup'
import { CheckboxGroup } from '@/components/forms/CheckboxGroup'
import { SelectInput } from '@/components/forms/SelectInput'
import { DateInput } from '@/components/forms/DateInput'
import { TelephoneInput } from '@/components/forms/TelephoneInput'
import { NumericInput } from '@/components/forms/NumericInput'
import { RangeInput } from '@/components/forms/RangeInput'
import { HtmlText } from '@/components/forms/HtmlText'

export const DynamicField = ({ field, value, error, onChange }) => {
    const commonProps = {
        label: field.label,
        name: field.name,
        value,
        onChange,
        error,
    }

    const renderField = () => {
        switch (field.type) {
            case 'textarea':
                return <TextArea {...commonProps} />
            case 'date':
                return <DateInput {...commonProps} />
            case 'tel':
                return <TelephoneInput {...commonProps} />
            case 'number':
                return <NumericInput {...commonProps} />
            case 'html':
                return <HtmlText label={field.label} />
            case 'range':
                return (
                    <RangeInput
                        {...commonProps}
                        min={field.min}
                        max={field.max}
                        step={field.step}
                    />
                )
            case 'radio':
                return (
                    <RadioGroup
                        {...commonProps}
                        options={field.options || []}
                    />
                )
            case 'checkbox':
                return (
                    <CheckboxGroup
                        {...commonProps}
                        options={field.options || []}
                    />
                )
            case 'select':
                return (
                    <SelectInput
                        {...commonProps}
                        options={field.options || []}
                    />
                )
            default:
                return (
                    <TextInput type={field.type || 'text'} {...commonProps} />
                )
        }
    }

    if (!field || !field.type) {
        console.warn(
            'DynamicField: Missing or invalid field configuration:',
            field,
        )
        return null
    }

    return renderField()
}
