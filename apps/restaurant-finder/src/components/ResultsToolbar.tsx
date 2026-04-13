type ResultsToolbarProps = {
  hasSearched: boolean;
  isLoading: boolean;
  resultCount: number;
  totalCount: number;
};

export const ResultsToolbar = ({
  hasSearched,
  isLoading,
  resultCount,
  totalCount,
}: ResultsToolbarProps) => {
  const summary = !hasSearched
    ? 'No search has been run yet.'
    : isLoading
      ? 'Refreshing restaurant data...'
      : `${resultCount} visible result${resultCount === 1 ? '' : 's'} from ${totalCount} restaurant${totalCount === 1 ? '' : 's'}.`;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-600">
          Search results
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
          Restaurants worth exploring
        </h2>
      </div>

      <div className="rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
        {summary}
      </div>
    </div>
  );
};
