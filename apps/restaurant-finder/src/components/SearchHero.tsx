import { FormEvent, useMemo, useState } from 'react';
import { Button, Card, CardBody, Chip } from '@heroui/react';

import { ApiHealthState } from '../hooks/useApiHealth';
import { SearchMode } from '../types/restaurant';

type SearchHeroProps = {
  apiHealth: ApiHealthState;
  isLoading: boolean;
  onSearch: (payload: { mode: SearchMode; query: string }) => Promise<void>;
  onSearchNearby: () => Promise<void>;
};

const searchPresets: Array<{ label: string; value: string; mode: SearchMode }> = [
  { label: 'Indianapolis', value: 'Indianapolis', mode: 'city' },
  { label: 'Chicago', value: 'Chicago', mode: 'city' },
  { label: '10012', value: '10012', mode: 'zip' },
];

export const SearchHero = ({ apiHealth, isLoading, onSearch, onSearchNearby }: SearchHeroProps) => {
  const [mode, setMode] = useState<SearchMode>('city');
  const [query, setQuery] = useState('');

  const content = useMemo(
    () =>
      mode === 'zip'
        ? {
            label: 'Search by zip code',
            placeholder: 'Enter a zip code like 10012 or 60614',
            helper: 'Best for precise neighborhood searches when you already know the zip.',
          }
        : {
            label: 'Search by city or area',
            placeholder: 'Search a city or area like Chicago, Austin, or Indianapolis',
            helper: 'Use a city, neighborhood, or local area to discover nearby places.',
          },
    [mode]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSearch({
      mode,
      query,
    });
  };

  const statusTone =
    apiHealth.status === 'checking'
      ? 'bg-white/10 text-slate-200'
      : apiHealth.reachable
        ? 'bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-400/25'
        : 'bg-amber-500/15 text-amber-100 ring-1 ring-amber-400/20';

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] border border-white/50 bg-[linear-gradient(135deg,#0f274f_0%,#1a4e7a_44%,#2f74a2_100%)] px-5 pb-12 pt-7 text-white shadow-[0_36px_120px_rgba(15,23,42,0.22)] sm:px-8 sm:pt-10 lg:px-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_20%),radial-gradient(circle_at_85%_15%,rgba(191,219,254,0.14),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(253,224,71,0.12),transparent_22%)]" />
      <div className="absolute -left-10 top-12 h-44 w-44 rounded-full bg-cyan-300/12 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-amber-200/10 blur-3xl" />

      <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1.15fr)_360px] xl:items-start">
        <div className="space-y-7">
          <div className="flex flex-wrap items-center gap-3">
            <Chip className="border-white/10 bg-white/10 px-3 text-white/95" variant="bordered">
              Restaurant Discovery
            </Chip>
            <div className={`rounded-full px-3 py-1 text-xs font-medium ${statusTone}`}>
              API:{' '}
              {apiHealth.status === 'checking'
                ? 'Checking'
                : apiHealth.reachable
                  ? 'Connected'
                  : 'Needs attention'}
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-[2.6rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl xl:max-w-2xl xl:text-[3.9rem]">
              Discover great restaurants with a search experience that feels polished and useful.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-sky-50/88 sm:text-lg">
              Search by city, zip code, or your current location, then browse a clearer set of cards
              with curated place details, contact info, and better scan-friendly filtering.
            </p>
          </div>

          <Card className="border border-white/14 bg-white/14 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <CardBody className="gap-6 p-5 sm:p-6">
              <div className="flex flex-wrap gap-2.5">
                <Button
                  className={
                    mode === 'city'
                      ? 'bg-white text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.15)]'
                      : 'border-white/15 bg-white/8 text-white'
                  }
                  radius="full"
                  variant={mode === 'city' ? 'solid' : 'bordered'}
                  onPress={() => setMode('city')}
                >
                  City or area
                </Button>
                <Button
                  className={
                    mode === 'zip'
                      ? 'bg-white text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.15)]'
                      : 'border-white/15 bg-white/8 text-white'
                  }
                  radius="full"
                  variant={mode === 'zip' ? 'solid' : 'bordered'}
                  onPress={() => setMode('zip')}
                >
                  Zip code
                </Button>
                <Button
                  className="border-white/15 bg-white/8 text-white"
                  radius="full"
                  variant="bordered"
                  onPress={onSearchNearby}
                >
                  Use my location
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.2),rgba(59,130,246,0.1))] p-4 sm:p-5">
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-white">{content.label}</p>
                    <p className="mt-1 text-sm text-sky-100/70">{content.helper}</p>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_190px] lg:items-end">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-100/70">
                        Search restaurants
                      </label>
                      <input
                        aria-label="Search restaurants"
                        className="h-16 w-full rounded-[1.35rem] border border-white/14 bg-slate-950/28 px-5 text-lg text-white outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-200/25"
                        placeholder={content.placeholder}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    </div>

                    <Button
                      className="h-16 w-full bg-[linear-gradient(135deg,#4ac3ff,#2d6df6)] text-base font-semibold text-white shadow-[0_22px_50px_rgba(37,99,235,0.35)]"
                      isLoading={isLoading}
                      radius="lg"
                      type="submit"
                    >
                      Search now
                    </Button>
                  </div>
                </div>
              </form>

              <div className="flex flex-wrap gap-2.5">
                {searchPresets.map((preset) => (
                  <Button
                    key={preset.label}
                    className="border-white/10 bg-white/8 text-slate-100"
                    radius="full"
                    size="sm"
                    variant="bordered"
                    onPress={async () => {
                      setMode(preset.mode);
                      setQuery(preset.value);
                      await onSearch({ mode: preset.mode, query: preset.value });
                    }}
                  >
                    Try {preset.label}
                  </Button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid gap-4 self-start">
          <Card className="border border-white/10 bg-white/14 shadow-none backdrop-blur-md">
            <CardBody className="space-y-5 p-6 text-white">
              <div>
                <p className="text-xs uppercase tracking-[0.32em] text-slate-300">API status</p>
                <h2 className="mt-3 text-2xl font-semibold">
                  {apiHealth.reachable
                    ? 'Connection looks healthy'
                    : apiHealth.status === 'checking'
                      ? 'Checking the upstream API'
                      : 'The API needs attention'}
                </h2>
              </div>
              <div className="space-y-3 text-sm text-slate-200">
                <p>{apiHealth.message}</p>
                {apiHealth.host ? (
                  <p className="text-slate-300/80">Host: {apiHealth.host}</p>
                ) : null}
                {apiHealth.reachable === false ? (
                  <p className="rounded-2xl bg-amber-500/10 p-3 text-amber-100">
                    Search UI is working, but the upstream request is not currently succeeding.
                  </p>
                ) : null}
              </div>
            </CardBody>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <Card className="border border-white/10 bg-white/10 shadow-none backdrop-blur-md">
              <CardBody className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(125,211,252,0.08))] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">UX focus</p>
                <p className="mt-2 text-lg font-semibold">
                  Cleaner cards with stronger scanning rhythm
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200/90">
                  Larger metadata blocks, clearer badges, and simpler action layout.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-white/10 shadow-none backdrop-blur-md">
              <CardBody className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(253,224,71,0.08))] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Data flow</p>
                <p className="mt-2 text-lg font-semibold">
                  Geoapify search with route-based details
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200/90">
                  Search results stay lightweight while detail pages fetch richer place data.
                </p>
              </CardBody>
            </Card>

            <Card className="border border-white/10 bg-white/10 shadow-none backdrop-blur-md sm:col-span-2 xl:col-span-1">
              <CardBody className="rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.07),rgba(96,165,250,0.08))] p-5 text-white">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-300">What to expect</p>
                <p className="mt-2 text-lg font-semibold">
                  Hours, contact info, links, and location context
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-200/90">
                  External links are only shown when the URL passes basic validation.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
