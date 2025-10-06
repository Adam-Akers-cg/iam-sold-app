// If you use react-bootstrap Card elsewhere, import it under an alias:
const PillResults = ({ answerPills }) => {
    if (!answerPills) return null
    return (
        <div className="mb-3">
            <div className="d-flex flex-wrap justify-content-center">
                {answerPills.map((p) => {
                    if (!p) return null
                    const Icon = iconMap[p.qName?.toLowerCase()]
                    return (
                        <span
                            key={p.key}
                            className="badge rounded-pill bg-primary text-white border fs-3 me-2 mb-2 px-3 py-2 d-flex align-items-center"
                        >
                            {Icon && <Icon className="me-4" size={20} />}
                            {p.display}
                        </span>
                    )
                })}
            </div>
        </div>
    )
}
export default PillResults
