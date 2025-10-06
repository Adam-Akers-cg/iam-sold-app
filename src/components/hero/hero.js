import React from 'react'
import clsx from 'clsx'
import style from './_hero.module.scss'

export default function HeroImage() {
    return (
        <div className={clsx(style['hero-custom'], 'p-5 text-center bg-image')}>
            <div
                className="mask"
                style={{ backgroundColor: 'rgb(0 0 0 / 60%)' }}
            >
                <div className="d-flex justify-content-center align-items-center h-100">
                    <div className="text-white">
                        <h1 className="mb-3 mt-2">MoveMatch</h1>
                        <p className="h3 mb-3"></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
