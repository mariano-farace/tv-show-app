import type { ApiResponse, ShowDetail, ShowSummary } from "../types/show";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8001/api";

async function request<T>(path: string): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`);
  } catch {
    throw new Error("No se pudo conectar con el servidor.");
  }

  if (!response.ok) {
    // Si el cuerpo no es JSON (una página HTML, por ejemplo), json() falla;
    // seguimos con el mensaje genérico en vez de un SyntaxError técnico.
    const body: { message?: string } | null = await response
      .json()
      .catch(() => null);

    // Solo enseñamos el mensaje del backend cuando es uno de los que
    // escribimos nosotros, el resto es irrelevante para el usuario.
    const useBackendMessage = [404, 429, 502].includes(response.status);
    const message = useBackendMessage ? body?.message : undefined;

    throw new Error(message ?? "Ha ocurrido un error inesperado.");
  }

  const body: ApiResponse<T> = await response.json();
  return body.data;
}

export function searchShows(query: string): Promise<ShowSummary[]> {
  return request<ShowSummary[]>(`/shows?q=${encodeURIComponent(query)}`);
}

export function getShow(id: string): Promise<ShowDetail> {
  return request<ShowDetail>(`/shows/${id}`);
}
