/**
 * One row in the link list.
 * "Presentational" component: it receives data + callbacks from App.jsx and renders UI.
 */
export default function LinkCard({
  url,
  shortLink,
  isCopied,
  isDeleting,
  onCopy,
  onDelete,
  onShortLinkClick,
}) {
  return (
    <li className="link-card">
      <div className="link-card-main">
        <a
          className="short-url"
          href={shortLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => onShortLinkClick(url.shortCode)}
        >
          {shortLink}
        </a>
        <a
          className="original-url"
          href={url.originalUrl}
          target="_blank"
          rel="noreferrer"
          title={url.originalUrl}
        >
          {url.originalUrl}
        </a>
      </div>

      <div className="link-card-meta">
        <span className="click-badge">
          <strong>{(url.clicks || 0).toLocaleString()}</strong>
          clicks
        </span>
        <code className="code-tag">{url.shortCode}</code>
      </div>

      <div className="link-card-actions">
        <button
          type="button"
          className={`action-btn${isCopied ? ' action-btn-success' : ''}`}
          title="Copy"
          onClick={() => onCopy(url.shortCode)}
        >
          {isCopied ? '✓' : 'Copy'}
        </button>
        <button
          type="button"
          className="action-btn action-btn-danger"
          title="Delete"
          disabled={isDeleting}
          onClick={() => onDelete(url._id)}
        >
          Delete
        </button>
      </div>
    </li>
  )
}
