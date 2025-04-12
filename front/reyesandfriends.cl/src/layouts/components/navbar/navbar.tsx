import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, ChevronDown } from "lucide-react"
import useNavOptions from "./useNavOptions"

const Navbar: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const { isDropdownOpen, toggleDropdown, closeDropdown, dropdownOptions } = useNavOptions()
    const dropdownRef = useRef<HTMLLIElement>(null)
    const location = useLocation()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const handleDropdownToggle = () => {
        if (isDropdownOpen) closeDropdown()
        else toggleDropdown()
    }

    useEffect(() => {
        closeDropdown()
    }, [location.pathname, closeDropdown])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown()
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [closeDropdown])

    return (
        <nav className="bg-black text-white py-2 z-50 relative">
            <div className="container mx-auto flex justify-between items-center px-4">
            <Link to="/">
                <img src="/img/reyesandfriends.svg" className="h-12" alt="Reyes and Friends Logo" />
            </Link>
            <ul className={`md:flex space-x-0 md:space-x-6 text-lg ${isMenuOpen ? "flex flex-col space-y-4 absolute top-full left-0 w-full bg-black p-4 z-50" : "hidden"} md:static md:flex-row md:space-y-0`}>
                <li>
                <Link to="/" className="hover:underline block" onClick={() => setIsMenuOpen(false)}>Inicio</Link>
                </li>
                <li>
                <Link to="/about" className="hover:underline block" onClick={() => setIsMenuOpen(false)}>Sobre nosotros</Link>
                </li>
                <li className="relative" ref={dropdownRef}>
                <button
                    onClick={handleDropdownToggle}
                    className="hover:underline focus:outline-none flex items-center"
                >
                    Nuestros servicios <ChevronDown className="ml-1" size={16} />
                </button>
                {isDropdownOpen && (
                    <ul className={`bg-white text-black mt-2 shadow-lg rounded md:absolute md:mt-2 md:py-2 md:w-40 ${isMenuOpen ? "w-full mt-2" : ""}`}>
                    {dropdownOptions.map(option => (
                        <li key={option.path}>
                        <Link
                            to={option.path}
                            className="block px-4 py-2 hover:bg-gray-200"
                            onClick={() => {
                            closeDropdown()
                            setIsMenuOpen(false)
                            }}
                        >
                            {option.label}
                        </Link>
                        </li>
                    ))}
                    </ul>
                )}
                </li>
                <li>
                <Link to="/portfolio" className="hover:underline block" onClick={() => setIsMenuOpen(false)}>Portafolio</Link>
                </li>
                <li>
                <Link to="/contact" className="hover:underline block" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
                </li>
            </ul>

            <div className="md:hidden">
                <button onClick={toggleMenu} className="focus:outline-none" aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
            </div>
        </nav>
    )
}

export default Navbar
