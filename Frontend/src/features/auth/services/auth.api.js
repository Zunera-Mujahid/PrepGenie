import axios from "axios"

const api=axios.create({      //to avoid repititive task
    baseURL:"http://localhost:3000",
    withCredentials:true      //for server to have access to read and set data in cookies
})

export async function register({ username, email, password }) {
    try {
        const response= await api.post('/api/auth/register', { username, email, password})    // ->http://localhost:3000/api/auth/login  but beause we use axios.create and set base url as http://localhost:3000   that's why we are using onle api/auth/login
        
        return response.data

    } catch (err) {

        console.log(err)
    }

}

export async function login({ email, password }) {

    try {
        const response= await api.post('/api/auth/login', {email, password})

        return response.data

    } catch (err) {

        console.log(err)
    }
}

export async function logout() {

    try {
        const response = await api.get('/api/auth/logout')

        return response.data

    } catch (err) {

        console.log(err)
    }
}

export async function getMe() {
    try {
        const response = await api.get('/api/auth/get-me')

        return response.data

    } catch (err) {
        console.log(err)
    }
}
