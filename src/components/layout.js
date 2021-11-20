import * as React from "react"
import { Link } from "gatsby"
import Toggle from './toggle'

import moon from "../images/moon.png"
import sun from "../images/sun.png"

const isBrowser = typeof window !== "undefined"

const Layout = ({ location, title, children }) => {
  let defaultTheme = "light"

  if (isBrowser) {
    defaultTheme = window.localStorage.getItem("theme")
  }

  const [theme, setTheme] = React.useState(defaultTheme)

  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header
  if (isBrowser) {
    window.__onThemeChange = (theme) => {
      setTheme(theme)
    }
  }

  if (isRootPath) {
    header = (
      <h1
        style={{ color: 'var(--textTitle)' }}
        className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" style={{
        color: 'var(--textTitle)',
      }} to="/">
        {title}
      </Link>
    )
  }

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath} style={{
      color: 'var(--textNormal)',
      background: 'var(--bg)',
      // transition: 'color 0.2s ease-out, background 0.2s ease-out',
      minHeight: '100vh',
    }}>
      <header className="global-header">
        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
          <div>{header}</div>

          <div>
            <Toggle
              icons={{
                checked: (
                  <img
                    src={sun}
                    width="16"
                    height="16"
                    role="presentation"
                    style={{ pointerEvents: 'none' }}
                  />
                ),
                unchecked: (
                  <img
                    src={moon}
                    width="16"
                    height="16"
                    role="presentation"
                    style={{ pointerEvents: 'none' }}
                  />
                ),
              }}
              checked={theme === 'dark'}
              onChange={e => {
                setTheme(e.target.checked ? 'dark' : 'light')
                window.__setPreferredTheme(
                  e.target.checked ? 'dark' : 'light'

                )
              }
              }
            />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer>© {new Date().getFullYear()}, All rights reserved.</footer>
    </div>
  )
}

export default Layout
