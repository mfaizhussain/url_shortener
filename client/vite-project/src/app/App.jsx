/**
 * URL Shortener — main React component
 *
 * Interview walkthrough:
 * 1. useState  → data that changes (links list, form input, loading flags)
 * 2. useEffect → run code when the page loads (fetch links from API)
 * 3. Handlers  → functions that run when the user clicks or submits
 * 4. JSX       → HTML-like UI that React renders
 *
 * Flow: React (Vite :5173) → proxy → Express (:3000) → MongoDB
 */
import { useEffect, useState } from 'react'
import { createShortUrl, deleteUrlById, getAllUrls } from '../api/urlApi.js'
import LinkCard from '../components/LinkCard.jsx'
import LogoIcon from '../components/LogoIcon.jsx'
import { SHORT_URL_BASE } from '../config.js'
import { getErrorMessage } from '../utils/getErrorMessage.js'
import './App.css'

function App() {
  // --- State: what the UI needs to remember ---
  const [urls, setUrls] = useState([])
  const [longUrlInput, setLongUrlInput] = useState('')
  const [lastCreated, setLastCreated] = useState(null)
  const [searchText, setSearchText] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [copiedCode, setCopiedCode] = useState(null)
  const [he, sethe] = useState(initialState)


  // --- Derived values (computed from state, no extra useState needed) ---
  const search = searchText.trim().toLowerCase()
  const filteredUrls = search
    ? urls.filter(
        (item) =>
          item.originalUrl.toLowerCase().includes(search)
          || item.shortCode.toLowerCase().includes(search),
      )
    : urls

  let totalClicks = 0
  for (const item of urls) {
    totalClicks += item.clicks || 0
  }

  // --- Load all links once when the app mounts ---
  useEffect(() => {
    async function loadLinksOnMount() {
      try {
        const list = await getAllUrls()
        setUrls(list)
      } catch (error) {
        setErrorMessage(getErrorMessage(error, 'Could not load links.'))
      } finally {
        setIsLoading(false)
      }
    }

    loadLinksOnMount()
  }, [])

  // --- Refresh list when user comes back to this browser tab ---
  useEffect(() => {
    async function refreshIfTabVisible() {
      if (document.visibilityState !== 'visible') return
      try {
        setUrls(await getAllUrls())
      } catch {
        // Silent fail — keep showing old data
      }
    }

    document.addEventListener('visibilitychange', refreshIfTabVisible)
    return () => document.removeEventListener('visibilitychange', refreshIfTabVisible)
  }, [])

  /** Re-fetch links from server (after create / delete) */
  async function reloadLinks() {
    const list = await getAllUrls()
    setUrls(list)
    setErrorMessage('')
  }

  /** Form submit: POST new long URL, then refresh the list */
  async function handleCreateSubmit(event) {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    setLastCreated(null)

    try {
      const created = await createShortUrl(longUrlInput.trim())
      setLastCreated(created)
      setLongUrlInput('')
      await reloadLinks()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Could not shorten this URL.'))
    } finally {
      setIsSubmitting(false)
    }
  }

  /** DELETE one link by MongoDB _id */
  async function handleDelete(id) {
    setDeletingId(id)
    setErrorMessage('')

    try {
      await deleteUrlById(id)
      await reloadLinks()
    } catch (error) {
      setErrorMessage(getErrorMessage(error, 'Could not delete this link.'))
    } finally {
      setDeletingId(null)
    }
  }

  /** Copy short URL to clipboard */
  async function handleCopy(shortCode) {
    const fullLink = `${SHORT_URL_BASE}/${shortCode}`
    try {
      await navigator.clipboard.writeText(fullLink)
      setCopiedCode(shortCode)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch {
      setErrorMessage('Could not copy. Allow clipboard access in your browser.')
    }
  }

  /**
   * User opened a short link in a new tab.
   * Backend increments clicks on GET /:code — we bump UI immediately, then sync.
   */
  function handleShortLinkClick(shortCode) {
    setUrls((previous) =>
      previous.map((item) => {
        if (item.shortCode !== shortCode) return item
        return { ...item, clicks: (item.clicks || 0) + 1 }
      }),
    )

    setTimeout(async () => {
      try {
        setUrls(await getAllUrls())
      } catch {
        // ignore
      }
    }, 700)
  }

  return (
    <div className="app">
      <div className="app-grid" aria-hidden="true" />

      <header className="site-header">
        <a className="brand" href="/">
          <span className="brand-icon"><LogoIcon /></span>
          <span className="brand-name">linklet</span>
        </a>
        <div className="header-stats">
          <div className="stat-pill">
            <span className="stat-pill-label">Links</span>
            <strong>{urls.length}</strong>
          </div>
          <div className="stat-pill">
            <span className="stat-pill-label">Clicks</span>
            <strong>{totalClicks}</strong>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <p className="hero-tag">URL shortener</p>
          <h1>
            Turn long links into
            <span className="hero-accent"> shareable paths</span>
          </h1>
          <p className="hero-lead">
            Paste a URL, get a short code, track clicks — all from one dashboard.
          </p>
        </section>

        <section className="shorten-panel">
          <form className="shorten-form" onSubmit={handleCreateSubmit}>
            <div className="url-field">
              <label className="url-label" htmlFor="long-url">Long URL</label>
              <input
                id="long-url"
                type="url"
                className="url-input"
                placeholder="https://example.com/very/long/path"
                value={longUrlInput}
                required
                maxLength={2048}
                onChange={(e) => setLongUrlInput(e.target.value)}
              />
            </div>
            <button className="submit-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Shortening…' : 'Shorten link'}
            </button>
          </form>

          {lastCreated && (
            <div className="created-banner">
              <span className="created-badge">New</span>
              <a
                className="created-link"
                href={`${SHORT_URL_BASE}/${lastCreated.shortCode}`}
                target="_blank"
                rel="noreferrer"
                onClick={() => handleShortLinkClick(lastCreated.shortCode)}
              >
                {`${SHORT_URL_BASE}/${lastCreated.shortCode}`}
              </a>
              <button
                type="button"
                className="copy-chip"
                onClick={() => handleCopy(lastCreated.shortCode)}
              >
                {copiedCode === lastCreated.shortCode ? 'Copied' : 'Copy'}
              </button>
            </div>
          )}
        </section>

        {errorMessage && (
          <div className="alert alert-error" role="alert">
            {errorMessage}
          </div>
        )}

        <section className="library" id="links">
          <div className="library-header">
            <div>
              <h2>Your links</h2>
              <p>{urls.length} saved</p>
            </div>
            <div className="search-wrap">
              <input
                id="link-search"
                type="search"
                className="search-input"
                placeholder="Search links"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
          </div>

          {isLoading && (
            <div className="state-panel">
              <p>Loading links…</p>
            </div>
          )}

          {!isLoading && filteredUrls.length === 0 && (
            <div className="state-panel state-empty">
              <LogoIcon />
              <strong>No links yet</strong>
              <p>Shorten a URL above to see it here.</p>
            </div>
          )}

          {!isLoading && filteredUrls.length > 0 && (
            <ul className="link-list">
              {filteredUrls.map((url) => (
                <LinkCard
                  key={url._id}
                  url={url}
                  shortLink={`${SHORT_URL_BASE}/${url.shortCode}`}
                  isCopied={copiedCode === url.shortCode}
                  isDeleting={deletingId === url._id}
                  onCopy={handleCopy}
                  onDelete={handleDelete}
                  onShortLinkClick={handleShortLinkClick}
                />
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <span>Linklet · URL Shortener project</span>
      </footer>
    </div>
  )
}

export default App
