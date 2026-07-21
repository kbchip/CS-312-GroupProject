import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import BookDetailsPage from './pages/BookDetailsPage'
import SignInPage from './pages/SignInPage'
import CreateAccountPage from './pages/CreateAccountPage'
import NavBar from './components/NavBar'

function App() {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        })

        if (!response.ok) {
          setUser(null)
          return
        }

        const data = await response.json()
        setUser(data.user)
      } catch {
        setUser(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    loadSession()
  }, [])

  const handleLogin = (nextUser) => {
    setUser(nextUser)
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })

    setUser(null)
  }

  if (isAuthLoading) {
    return (
      <>
        <NavBar user={null} isAuthLoading={true} onLogout={handleLogout} />
        <main className="container py-5">
          <p className="text-muted mb-0">Loading session...</p>
        </main>
      </>
    )
  }

  return (
    <>
      <NavBar user={user} isAuthLoading={false} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />
        <Route
          path="/sign-in"
          element={user ? <Navigate to="/" replace /> : <SignInPage onLogin={handleLogin} />}
        />
        <Route
          path="/create-account"
          element={user ? <Navigate to="/" replace /> : <CreateAccountPage onLogin={handleLogin} />}
        />
      </Routes>
    </>
  )
}

export default App
