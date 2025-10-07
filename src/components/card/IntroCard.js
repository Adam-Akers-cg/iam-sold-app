import clsx from 'clsx'
import style from '../forms/multi-step-form.module.scss'

const IntroCard = ({ intro, scoreTitle, scoreDescription }) => {
    if (!intro) return null
    return (
        <div
            className={clsx('card mb-3', style['intro-card'], 'border-primary')}
        >
            <div className="card-body">
                <h5 className="card-title">{scoreTitle}</h5>
                <p className="card-text">{scoreDescription}</p>
            </div>
        </div>
    )
}
export default IntroCard
