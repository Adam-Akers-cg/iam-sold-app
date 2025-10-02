// NavContext.js
import { createContext, useContext, useState, useEffect } from 'react'

const NavContext = createContext()

export const NavProvider = ({ children }) => {
    const [nav, setNav] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchServices = async () => {
        setLoading(true)
        setError(null)
        try {
            // Use absolute path to ensure root API route is hit
            const response = await fetch('/api/getNav')
            if (!response.ok) {
                // read server error message (if any) for dev debugging
                const serverBody = await response.json().catch(() => ({}))
                throw new Error(serverBody?.error || 'Failed to fetch nav list')
            }
            const data = await response.json()
            setNav(data || [])
        } catch (err) {
            console.error('Error fetching nav list:', err)
            setError(err.message || 'Failed to load nav list')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchServices()
    }, [])

    return (
        <NavContext.Provider value={{ nav, loading, error }}>
            {children}
        </NavContext.Provider>
    )
}

export const useNav = () => useContext(NavContext)
