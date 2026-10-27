/**
 * API layer — all HTTP calls to the backend live here.
 * In an interview: "The UI does not call axios directly; it uses these functions."
 */
import axios from 'axios'

const API_URL = '/api/url'

/** GET /api/url — fetch every saved short link */
export async function getAllUrls() {
  const response = await axios.get(API_URL)
  return response.data.data.urls
}

/** POST /api/url — body: { url: "https://..." } */
export async function createShortUrl(longUrl) {
  const response = await axios.post(API_URL, { url: longUrl })
  return response.data.data
}

/** DELETE /api/url/:id */
export async function deleteUrlById(id) {
  await axios.delete(`${API_URL}/${id}`)
}
