// File: components/forms/HtmlText.js
import { Form } from 'react-bootstrap'

export const HtmlText = ({ label }) => (
    <Form.Group className="mb-3">
        <div dangerouslySetInnerHTML={{ __html: label }} />
    </Form.Group>
)
