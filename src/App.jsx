import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'
import BookDetailsPage from './pages/BookDetailsPage'
import SignInPage from './pages/SignInPage'
import CreateAccountPage from './pages/CreateAccountPage'
import NavBar from './components/NavBar'

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<BookDetailsPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/create-account" element={<CreateAccountPage />} />
      </Routes>
    </>
  )
}

export default App
