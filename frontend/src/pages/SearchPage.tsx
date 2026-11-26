import type { SubmitEvent } from "react";
import ShowCard from "../components/ShowCard";
import { useSearchStore } from "../store/searchStore";

function SearchPage() {
  const { query, shows, status, errorMessage, setQuery, search } =
    useSearchStore();

  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    search(trimmed);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-4 text-2xl font-bold">Buscador de series</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Nombre de la serie"
          maxLength={100}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="flex-1 rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
        >
          Buscar
        </button>
      </form>

      {status === "loading" && (
        <div className="mx-auto my-8 h-6 w-6 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900 dark:border-neutral-700 dark:border-t-neutral-100" />
      )}

      {status === "error" && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}

      {status === "success" && shows.length === 0 && (
        <p>No hay resultados para tu búsqueda.</p>
      )}

      {status === "success" && shows.length > 0 && (
        <ul className="grid list-none grid-cols-2 gap-4 p-0 lg:grid-cols-4">
          {shows.map((show) => (
            <li key={show.id}>
              <ShowCard show={show} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default SearchPage;
