import { useContext} from "react";
import { AuthContext } from "../auth.context.jsx";
import { login, register, logout } from "../services/auth.api.js"


export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading} = context

    const handleLogin = async ({ email, password }) => {

        try {
            const data = await login({ email, password })  //calling api
            setUser(data.user)
        } catch (err) {

        }
    }

    const handleRegister = async ({ username, email, password }) => {

        setLoading(true)
        try {
            const data = await register({ username, email, password })
            setUser(data.user)
        } catch (err) {

        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {

        setLoading(true)
        try {
            const data = await logout()
            setUser(null)
        } catch (err) {

        } finally {
            setLoading(false)

        }


    }

  

    return { user, loading, handleLogin, handleRegister, handleLogout }
}