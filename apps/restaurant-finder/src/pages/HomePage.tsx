import { useMemo } from 'react';
import { Button, Divider } from '@heroui/react';

import { EmptyState } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { LoadingState } from '../components/LoadingState';
import { RestaurantGrid } from '../components/RestaurantGrid';
import { ResultsToolbar } from '../components/ResultsToolbar';
import { SearchHero } from '../components/SearchHero';
import { StatusMessage } from '../components/StatusMessage';
import { useApiHealth } from '../hooks/useApiHealth';
import { useRestaurantSearch } from '../hooks/useRestaurantSearch';
import { createFilterOptions, filterRestaurants } from '../utils/restaurant';

export const HomePage = () => {
  const {
    filters,
    hasSearched,
    isLoading,
    error,
    restaurants,
    setFilters,
    runSearch,
    searchNearby,
    clearResults,
  } = useRestaurantSearch();
  const apiHealth = useApiHealth();

  const filterOptions = useMemo(() => createFilterOptions(restaurants), [restaurants]);
  const visibleRestaurants = useMemo(
    () => filterRestaurants(restaurants, filters),
    [filters, restaurants]
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_20%),radial-gradient(circle_at_85%_18%,_rgba(251,191,36,0.12),_transparent_18%),linear-gradient(180deg,_#eef8ff_0%,_#f7fbff_26%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <SearchHero
          apiHealth={apiHealth}
          isLoading={isLoading}
          onSearch={runSearch}
          onSearchNearby={searchNearby}
        />

        <section className="relative -mt-8 overflow-hidden rounded-[2.2rem] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.99),rgba(248,250,252,0.97))] p-5 shadow-[0_26px_90px_rgba(7,17,31,0.12)] backdrop-blur-xl sm:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(18,158,234,0.6),transparent)]" />

          <ResultsToolbar
            hasSearched={hasSearched}
            isLoading={isLoading}
            resultCount={visibleRestaurants.length}
            totalCount={restaurants.length}
          />

          <Divider className="my-7" />

          <FilterBar filters={filters} options={filterOptions} onChange={setFilters} />

          <div className="mt-10 space-y-7">
            {apiHealth.status === 'error' ? (
              <StatusMessage
                description={apiHealth.message}
                tone="warning"
                title="API connection needs attention"
              />
            ) : null}

            {error ? (
              <StatusMessage description={error} tone="danger" title="Search unavailable" />
            ) : null}

            {!error && !hasSearched ? (
              <EmptyState
                description="Start with a city, zip code, or your current location to explore restaurant data."
                title="Ready to find your next spot?"
              />
            ) : null}

            {!error && hasSearched && isLoading ? <LoadingState /> : null}

            {!error && hasSearched && !isLoading && restaurants.length === 0 ? (
              <EmptyState
                description="Try a nearby city, a different zip code, or switch to current location search."
                title="No restaurants matched that search"
              />
            ) : null}

            {!error &&
            hasSearched &&
            !isLoading &&
            restaurants.length > 0 &&
            visibleRestaurants.length === 0 ? (
              <EmptyState
                description="Adjust the cuisine or price filters to broaden the result set."
                title="Filters removed every match"
              >
                <Button color="primary" variant="flat" onPress={clearResults}>
                  Clear results
                </Button>
              </EmptyState>
            ) : null}

            {!error && !isLoading && visibleRestaurants.length > 0 ? (
              <RestaurantGrid restaurants={visibleRestaurants} />
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
};
