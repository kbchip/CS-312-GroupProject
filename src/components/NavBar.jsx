import { NavLink } from 'react-router-dom'

function NavBar({ user, isAuthLoading, onLogout }) {
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? 'active fw-semibold' : ''}`

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom px-3">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">
          Book Reviews
        </NavLink>

        <button 
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            {isAuthLoading ? null : user ? (
              <>
                <li className="nav-item d-flex align-items-center px-2 text-muted">
                  Signed in as {user.username}
                </li>
                <li className="nav-item">
                  <button type="button" className="btn btn-link nav-link" onClick={onLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/sign-in" className={linkClass}>
                    Sign In
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/create-account" className={linkClass}>
                    Create Account
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default NavBar