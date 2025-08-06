import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAthStore'
import { Power, Rabbit, Settings } from 'lucide-react'

export const NavBar = () => {
    const { logout, authUser } = useAuthStore()

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">
                    Bubbly
                </Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-2">
                    <li>
                        <Link to="/settings">
                            <Settings className="h-7 w-5" />
                        </Link>
                    </li>
                    {authUser ? (
                        <>
                            <li>
                                <Link to="/profile" onClick={logout}>
                                    <Rabbit className="h-7 w-5" />
                                </Link>
                            </li>
                            <li>
                                <Link to="/logout" onClick={logout}>
                                    <Power className="h-7 w-5" />
                                </Link>
                            </li>
                        </>
                    ) : (
                        <></>
                    )}
                </ul>
            </div>
        </div>
    )
}
