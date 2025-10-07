const ResultCard = ({ item, rank }) => {
    // defensive: if no item, render nothing
    if (!item) return null

    // defensive: ensure we display primitives; don't try to render raw objects
    const safeReasons = Array.isArray(item.reasons) ? item.reasons : []

    return (
        // Use your own markup or react-bootstrap's Card under the alias BootstrapCard
        <div className="card mb-3 flex-fill">
            <div className="card-body">
                <h5 className="card-title">
                    {rank}. {String(item.label)}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">
                    Score: {Number(item.total)}
                </h6>

                {safeReasons.length > 0 ? (
                    <div>
                        <strong>
                            Reason{safeReasons.length > 1 ? 's' : ''}:
                        </strong>
                        <ul className="list-group list-group-flush">
                            {safeReasons.map((r, i) => (
                                // ensure reason is stringifiable
                                <li key={i} className="list-group-item">
                                    {typeof r === 'string'
                                        ? r
                                        : JSON.stringify(r)}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p className="text-muted">
                        No specific reasons contributed to this result.
                    </p>
                )}
            </div>
        </div>
    )
}
export default ResultCard
