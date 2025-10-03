// components/SaveAndPrint.jsx
import React from 'react'
import PropTypes from 'prop-types'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { BsPrinter } from 'react-icons/bs'

/**
 * SaveAndPrint
 *
 * Props:
 * - targetId (string) : id of the DOM element to capture (required)
 * - filename (string) : filename for the PDF (default: recommendations.pdf)
 * - children (node) : button content (default: 'Save & Print')
 * - className (string) : className for the button
 * - onStart/onComplete/onError : callbacks for lifecycle
 * - options : { orientation, unit, format, scale, marginTop }
 * - autoPrint (bool) : if true, attempt to call print() on opened tab (default true)
 * - openInNewTab (bool) : if true open the generated PDF in new tab (default true)
 */
export default function SaveAndPrint({
    targetId,
    filename = 'recommendations.pdf',
    children = 'Save & Print',
    className = 'btn btn-outline-primary mb-3 mt-3',
    onStart = () => {},
    onComplete = () => {},
    onError = () => {},
    options = {},
    autoPrint = true,
    openInNewTab = true,
    disabled = false,
}) {
    const {
        orientation = 'portrait', // 'portrait' or 'landscape'
        unit = 'pt',
        format = 'a4',
        scale = 2, // html2canvas scale (higher = higher quality, more memory)
        marginTop = 20,
    } = options

    async function generatePdf() {
        onStart()
        try {
            const element = document.getElementById(targetId)
            if (!element)
                throw new Error(`Element with id="${targetId}" not found.`)

            // Render the element to canvas
            const canvas = await html2canvas(element, {
                scale,
                useCORS: true,
                logging: false,
            })

            const imgData = canvas.toDataURL('image/png')

            // create jsPDF instance
            const pdf = new jsPDF({
                orientation,
                unit,
                format,
            })

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()

            const imgProps = {
                width: canvas.width,
                height: canvas.height,
            }

            // Fit image inside the page while preserving aspect ratio
            const ratio = Math.min(
                (pageWidth - marginTop * 2) / imgProps.width,
                (pageHeight - marginTop * 2) / imgProps.height,
            )
            const imgRenderWidth = imgProps.width * ratio
            const imgRenderHeight = imgProps.height * ratio
            const marginX = (pageWidth - imgRenderWidth) / 2
            const marginY = marginTop

            pdf.addImage(
                imgData,
                'PNG',
                marginX,
                marginY,
                imgRenderWidth,
                imgRenderHeight,
            )

            onComplete({ pdf, canvas })

            // If asked to open in new tab — use bloburl and attempt to print; fallback to save
            if (openInNewTab) {
                try {
                    const blobUrl = pdf.output('bloburl')
                    const newWin = window.open(blobUrl, '_blank')
                    if (newWin) {
                        // focus and attempt to print if requested
                        newWin.focus()
                        if (autoPrint) {
                            // give the new window a moment to load the PDF then call print
                            setTimeout(() => {
                                try {
                                    newWin.print()
                                } catch (err) {
                                    /* ignore */
                                }
                            }, 500)
                        }
                    } else {
                        // popup blocked: fallback to save
                        pdf.save(filename)
                    }
                } catch (e) {
                    // fallback to save in case of issues
                    pdf.save(filename)
                }
            } else {
                // directly download
                pdf.save(filename)
            }
        } catch (err) {
            console.error('SaveAndPrint error:', err)
            onError(err)
        }
    }

    return (
        <button
            type="button"
            className={className}
            onClick={generatePdf}
            disabled={disabled}
            aria-label="Save and print"
        >
            <BsPrinter className="me-2" />
            {children}
        </button>
    )
}

SaveAndPrint.propTypes = {
    targetId: PropTypes.string.isRequired,
    filename: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    onStart: PropTypes.func,
    onComplete: PropTypes.func,
    onError: PropTypes.func,
    options: PropTypes.object,
    autoPrint: PropTypes.bool,
    openInNewTab: PropTypes.bool,
    disabled: PropTypes.bool,
}
