'use client'
import { FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { jwtDecode, JwtPayload } from "jwt-decode";
import { loginUser } from './api/actions';

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();

  const handleGoogleLogin = () => {
    router.push('/login')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    const data = await loginUser(formData)
    if (data.error) {
      toast.error(data.error)
    } else {
      const decodedToken = jwtDecode<JwtPayload>(data.access)
      const lat = decodedToken.center.lat
      const lng = decodedToken.center.lng
      toast.success('Inicio de sesión exitoso')
      router.push(`/map?lat=${lat}&lng=${lng}`)
    }
  }
  return (
    <div className="flex h-screen bg-gray-800 text-white">
      <div className="m-auto w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-gray-700 p-6 rounded-t-lg">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <button 
              className="bg-blue-500 hover:bg-blue-600 p-2 rounded mb-3"
              onClick={handleGoogleLogin}
              >
              Login with Google
            </button>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-600 rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 bg-gray-600 rounded"
              />
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 p-2 rounded"
              >
                Log In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}