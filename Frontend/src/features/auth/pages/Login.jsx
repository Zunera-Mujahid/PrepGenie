import React,{useState} from "react"
import "../auth.form.scss"
import { Link } from "react-router"
import { useAuth } from '../hooks/useAuth.js'
import { useNavigate } from "react-router"

const Login = () => {

    const { handleLogin } = useAuth()
    const [loginLoading, setLoginLoading] = useState(false)
    

    const navigate=useNavigate()


    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoginLoading(true)
        try{
            await handleLogin({email,password})
        navigate('/')
        }catch(error){
            console.log(error)
        }finally{
            setLoginLoading(false)
        }
    }
        
    
       
    

    return (
        <main>
            <div className="form-container">
                <h1>Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name="email" placeholder="Enter email address" />
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}

                            type="password" id="password" name="password" placeholder="Enter password" />
                    </div>

                    <button
    className="button primary-button"
    disabled={loginLoading}
>
    {loginLoading ? "Logging you in..." : "Login"}
</button>

                </form>

                <p>Don't have an account?<Link to={"/register"}><b><u>Register</u></b></Link></p>

            </div>
        </main>
    )
}
export default Login