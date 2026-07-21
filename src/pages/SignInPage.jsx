import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function SignInPage({ onLogin }) {
	const location = useLocation()
	const navigate = useNavigate()
	const [form, setForm] = useState({
		email: '',
		password: '',
	})
	const [error, setError] = useState('')
	const [message, setMessage] = useState(location.state?.message || '')
	const [isSubmitting, setIsSubmitting] = useState(false)

    // refresh page to keep success message from lingering
	useEffect(() => {
		if (location.state?.message) {
			navigate(location.pathname, { replace: true, state: null })
		}
	}, [location.pathname, location.state, navigate])

    // keep form synced with user input
	const handleChange = (event) => {
		const { name, value } = event.target

		setForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setError('')
		setMessage('')
		setIsSubmitting(true)

		try {
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(form),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || data || 'Unable to sign in')
			}

			onLogin?.(data.user)
			setMessage('Signed in successfully.')
			setForm({ email: '', password: '' })
			navigate('/', { replace: true, state: { message: 'Signed in successfully.' } })
		} catch (submitError) {
			setError(submitError.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-4">
			<div style={{ width: '100%', maxWidth: '440px' }}>
				<h1>Sign in</h1>
				<p>Use the email and password from your account.</p>

				<form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
					<div style={{ display: 'grid', gap: '0.25rem' }}>
						<label htmlFor="email">Email</label>
						<input
							id="email"
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							required
						/>
					</div>

					<div style={{ display: 'grid', gap: '0.25rem' }}>
						<label htmlFor="password">Password</label>
						<input
							id="password"
							name="password"
							type="password"
							value={form.password}
							onChange={handleChange}
							required
						/>
					</div>

					{error ? <div>{error}</div> : null}
					{message ? <div>{message}</div> : null}

					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Signing in...' : 'Sign in'}
					</button>
				</form>

				<p>
					Need an account? <Link to="/create-account">Create one</Link>
				</p>
			</div>
		</div>
	)
}

export default SignInPage