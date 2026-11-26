import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getShow } from "../api/client";
import type { ShowDetail } from "../types/show";

type Status = "loading" | "error" | "success";

function stripHtml(html: string): string {
  const doc = new DOMParser().parseFromString(
    html.replace(/<\/(p|div)>/gi, " "),
    "text/html",
  );
  return (doc.body.textContent ?? "").replace(/\s+/g, " ").trim();
}

function DetailPage() {
  const { id } = useParams();
  const validId = id !== undefined && /^\d+$/.test(id);
  const [show, setShow] = useState<ShowDetail | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!id || !/^\d+$/.test(id)) {
      return;
    }

    getShow(id)
      .then((result) => {
        setShow(result);
        setStatus("success");
      })
      .catch((error) => {
        setErrorMessage(
          error instanceof Error ? error.message : "Ha ocurrido un error.",
        );
        setStatus("error");
      });
  }, [id]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <Link to="/" className="text-sm text-neutral-500 hover:underline">
        ← Volver a la búsqueda
      </Link>

      {!validId && (
        <p role="alert" className="mt-6 text-sm text-red-600 dark:text-red-400">
          Serie no encontrada.
        </p>
      )}

      {validId && status === "loading" && (
        <div className="mx-auto my-8 h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
      )}

      {validId && status === "error" && (
        <p role="alert" className="mt-6 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {validId && status === "success" && show && (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[300px_1fr]">
          <div>
            {show.image ? (
              <img
                src={show.image.original}
                alt={`Póster de ${show.name}`}
                className="w-full rounded-lg"
              />
            ) : (
              <div className="flex aspect-[2/3] items-center justify-center rounded-lg bg-neutral-200 text-sm text-neutral-500 dark:bg-neutral-800">
                Sin imagen
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold">{show.name}</h1>
            <p className="mt-1 text-sm text-neutral-500">
              {[
                show.rating.average !== null
                  ? `${show.rating.average} / 10`
                  : "Sin puntuación",
                show.genres.join(", "),
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>

            <dl className="mt-6 grid grid-cols-[130px_1fr] gap-y-2 text-sm">
              <dt className="text-neutral-500">Estado</dt>
              <dd>{show.status}</dd>

              <dt className="text-neutral-500">Estreno</dt>
              <dd>
                {show.premiered
                  ? new Date(`${show.premiered}T00:00:00`).toLocaleDateString(
                      "es-ES",
                    )
                  : "—"}
              </dd>

              <dt className="text-neutral-500">Cadena</dt>
              <dd>{show.network?.name ?? show.webChannel?.name ?? "—"}</dd>

              <dt className="text-neutral-500">Idioma</dt>
              <dd>{show.language ?? "—"}</dd>

              <dt className="text-neutral-500">Duración</dt>
              <dd>{show.runtime ? `${show.runtime} min` : "—"}</dd>

              <dt className="text-neutral-500">Web oficial</dt>
              <dd>
                {show.officialSite ? (
                  <a
                    href={show.officialSite}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {show.officialSite}
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </dl>

            <p className="mt-6 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
              {show.summary ? stripHtml(show.summary) : "Sin sinopsis."}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default DetailPage;
