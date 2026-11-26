import { Link } from "react-router-dom";
import type { ShowSummary } from "../types/show";

interface ShowCardProps {
  show: ShowSummary;
}

function ShowCard({ show }: ShowCardProps) {
  const rating = show.rating.average;

  return (
    <article>
      <Link
        to={`/shows/${show.id}`}
        className="block aspect-[2/3] overflow-hidden rounded-lg bg-neutral-200 transition-transform duration-200 hover:scale-[1.03] dark:bg-neutral-800"
      >
        {show.image ? (
          <img
            src={show.image.medium}
            alt={show.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <p className="flex h-full items-center justify-center text-sm text-neutral-500">
            Sin imagen
          </p>
        )}
      </Link>

      <h2 className="mt-2 truncate text-sm font-semibold">
        <Link
          to={`/shows/${show.id}`}
          className="text-neutral-900 hover:underline dark:text-neutral-100"
        >
          {show.name}
        </Link>
      </h2>
      <p className="truncate text-xs text-neutral-500">
        {show.genres.length > 0
          ? show.genres.join(", ")
          : "Género no disponible"}
      </p>
      <p className="text-xs text-neutral-500">
        {rating !== null ? `${rating} / 10` : "Sin puntuación"}
      </p>
    </article>
  );
}

export default ShowCard;
