// If you use react-bootstrap Card elsewhere, import it under an alias:
const DebugResults = ({ results }) => {
    if (!results) return null
    return (
        <details>
            <summary>Debug — full totals</summary>
            <pre>{JSON.stringify(results, null, 2)}</pre>
        </details>
    )
}
export default DebugResults
