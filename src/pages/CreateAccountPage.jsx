import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function CreateAccountPage({ onLogin }) {
	const navigate = useNavigate()
	const [form, setForm] = useState({
		username: '',
		email: '',
		password: '',
	})
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

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
		setIsSubmitting(true)

		try {
			const response = await fetch('/api/auth/register', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				credentials: 'include',
				body: JSON.stringify(form),
			})

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error || 'Unable to create account')
			}

			onLogin?.(data.user)
			setForm({ username: '', email: '', password: '' })
			navigate('/', {
				replace: true,
				state: {
					message: 'Account created and signed in.',
				},
			})
		} catch (submitError) {
			setError(submitError.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<div className="min-vh-100 d-flex align-items-center justify-content-center px-3 py-4">
			<div style={{ width: '100%', maxWidth: '480px' }}>
				<h1>Create your account</h1>
				<p>Join the book reviews community in just a few steps.</p>

				<form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
					<div style={{ display: 'grid', gap: '0.25rem' }}>
						<label htmlFor="username">Username</label>
						<input
							id="username"
							name="username"
							type="text"
							value={form.username}
							onChange={handleChange}
							required
						/>
					</div>

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

					<button type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Creating account...' : 'Create account'}
					</button>
				</form>

				<p>
					Already have an account? <Link to="/sign-in">Sign in</Link>
				</p>
			</div>
		</div>
	)
}

export default CreateAccountPage