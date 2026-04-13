import { useEffect, useMemo, useState } from 'react';
import { Button, Card, CardBody, Chip, Divider, Skeleton } from '@heroui/react';
import { Link, useParams } from 'react-router-dom';

import { EmptyState } from '../components/EmptyState';
import { StatusMessage } from '../components/StatusMessage';
import { fetchRestaurantById } from '../services/restaurants';
import { RestaurantSummary } from '../types/restaurant';
import {
  formatCategoryLabel,
  formatCuisineList,
  formatLocationLine,
  formatPhoneNumber,
  formatPriceRange,
  getWebsiteLabel,
  normalizeWebsiteUrl,
} from '../utils/formatters';

const DetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <Card className="border border-sky-100 bg-white">
        <CardBody className="gap-4 p-8">
          <Skeleton className="h-6 w-40 rounded-full" />
          <Skeleton className="h-12 w-3/4 rounded-2xl" />
          <Skeleton className="h-6 w-1/2 rounded-2xl" />
        </CardBody>
      </Card>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_360px]">
        <Card className="border border-slate-200 bg-white">
          <CardBody className="gap-4 p-8">
            <Skeleton className="h-8 w-40 rounded-2xl" />
            <Skeleton className="h-28 rounded-3xl" />
            <Skeleton className="h-28 rounded-3xl" />
          </CardBody>
        </Card>
        <Card className="border border-slate-200 bg-white">
          <CardBody className="gap-4 p-8">
            <Skeleton className="h-8 w-28 rounded-2xl" />
            <Skeleton className="h-20 rounded-3xl" />
            <Skeleton className="h-20 rounded-3xl" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export const RestaurantDetailsPage = () => {
  const { restaurantId = '' } = useParams();
  const decodedRestaurantId = useMemo(() => decodeURIComponent(restaurantId), [restaurantId]);
  const [restaurant, setRestaurant] = useState<RestaurantSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadRestaurant = async () => {
      setIsLoading(true);
      setError('');

      try {
        const nextRestaurant = await fetchRestaurantById(decodedRestaurantId);

        if (!isMounted) {
          return;
        }

        setRestaurant(nextRestaurant);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error ? loadError.message : 'We could not load restaurant details.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadRestaurant();

    return () => {
      isMounted = false;
    };
  }, [decodedRestaurantId]);

  const websiteUrl = normalizeWebsiteUrl(restaurant?.restaurantWebsite || '');
  const mapUrl =
    restaurant?.geo.lat && restaurant.geo.lon
      ? `https://www.google.com/maps/search/?api=1&query=${restaurant.geo.lat},${restaurant.geo.lon}`
      : '';

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.16),_transparent_20%),radial-gradient(circle_at_top_right,_rgba(251,191,36,0.1),_transparent_18%),linear-gradient(180deg,_#eef8ff_0%,_#f8fbff_28%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            className="inline-flex items-center rounded-full border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-sky-300 hover:text-sky-700"
            to="/"
          >
            Back to results
          </Link>
        </div>

        {isLoading ? <DetailSkeleton /> : null}

        {!isLoading && error ? (
          <StatusMessage
            description={error}
            tone="danger"
            title="Restaurant details are unavailable"
          />
        ) : null}

        {!isLoading && !error && !restaurant ? (
          <EmptyState
            description="We could not find a restaurant for that route. Try returning to the results list."
            title="Restaurant not found"
          />
        ) : null}

        {!isLoading && !error && restaurant ? (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[2.25rem] border border-white/70 bg-[linear-gradient(135deg,#0e2a4f_0%,#1d5d86_45%,#3b82f6_100%)] text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)]">
              <div className="bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_24%)] px-6 py-8 sm:px-8 sm:py-10">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip className="bg-white/12 text-white" variant="flat">
                    {restaurant.cuisines[0]
                      ? formatCategoryLabel(restaurant.cuisines[0])
                      : 'Restaurant'}
                  </Chip>
                  {restaurant.priceRange ? (
                    <Chip className="bg-amber-300/18 text-amber-50" variant="flat">
                      {formatPriceRange(restaurant.priceRange)}
                    </Chip>
                  ) : null}
                  {restaurant.highlights.slice(0, 2).map((highlight) => (
                    <Chip key={highlight} className="bg-white/10 text-white" variant="flat">
                      {highlight}
                    </Chip>
                  ))}
                </div>

                <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
                  <div>
                    <p className="text-sm uppercase tracking-[0.22em] text-sky-100/80">
                      Restaurant details
                    </p>
                    <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
                      {restaurant.restaurantName}
                    </h1>
                    <p className="mt-4 max-w-2xl text-base leading-8 text-sky-50/88 sm:text-lg">
                      {restaurant.address.formatted ||
                        formatLocationLine(restaurant) ||
                        'Address unavailable'}
                    </p>
                  </div>

                  <Card className="border border-white/12 bg-white/12 shadow-none backdrop-blur-md">
                    <CardBody className="gap-3 p-5 text-white">
                      <p className="text-xs uppercase tracking-[0.26em] text-slate-300">
                        Quick facts
                      </p>
                      <p className="text-sm text-slate-100">
                        {formatCuisineList(restaurant.cuisines)}
                      </p>
                      <p className="text-sm text-slate-100">
                        {restaurant.hours || 'Hours not provided'}
                      </p>
                      <p className="text-sm text-slate-100">
                        {formatPhoneNumber(restaurant.restaurantPhone)}
                      </p>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_360px]">
              <div className="space-y-6">
                <Card className="border border-sky-100 bg-white">
                  <CardBody className="gap-5 p-6 sm:p-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700/80">
                        Overview
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                        A cleaner look at the place data
                      </h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-[1.4rem] bg-sky-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700/70">
                          Cuisine / category
                        </p>
                        <p className="mt-2 text-base font-medium text-slate-900">
                          {formatCuisineList(restaurant.cuisines)}
                        </p>
                      </div>
                      <div className="rounded-[1.4rem] bg-amber-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700/70">
                          Price level
                        </p>
                        <p className="mt-2 text-base font-medium text-slate-900">
                          {formatPriceRange(restaurant.priceRange)}
                        </p>
                      </div>
                      <div className="rounded-[1.4rem] bg-emerald-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700/70">
                          Phone
                        </p>
                        <p className="mt-2 text-base font-medium text-slate-900">
                          {formatPhoneNumber(restaurant.restaurantPhone)}
                        </p>
                      </div>
                      <div className="rounded-[1.4rem] bg-violet-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-700/70">
                          Hours
                        </p>
                        <p className="mt-2 text-base font-medium text-slate-900">
                          {restaurant.hours || 'Hours not provided'}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="border border-sky-100 bg-white">
                  <CardBody className="gap-5 p-6 sm:p-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700/80">
                        Location details
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                        Address and map context
                      </h2>
                    </div>
                    <div className="rounded-[1.5rem] bg-slate-50 p-5">
                      <p className="text-base leading-8 text-slate-700">
                        {restaurant.address.formatted || 'Address not available'}
                      </p>
                      <Divider className="my-4" />
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            City
                          </p>
                          <p className="mt-2 text-sm text-slate-800">
                            {restaurant.address.city || 'Unavailable'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            State
                          </p>
                          <p className="mt-2 text-sm text-slate-800">
                            {restaurant.address.state || 'Unavailable'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                            Zip code
                          </p>
                          <p className="mt-2 text-sm text-slate-800">
                            {restaurant.address.postalCode || 'Unavailable'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card className="border border-sky-100 bg-white">
                  <CardBody className="gap-5 p-6 sm:p-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700/80">
                        Menu and extras
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                        Additional data available for this place
                      </h2>
                    </div>
                    {restaurant.menus.length ? (
                      <div className="space-y-4">
                        {restaurant.menus.map((menu) => (
                          <div key={menu.menuName} className="rounded-[1.5rem] bg-slate-50 p-5">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {menu.menuName}
                            </h3>
                            <div className="mt-4 space-y-4">
                              {menu.menuSections.map((section) => (
                                <div key={section.sectionName}>
                                  <p className="font-medium text-slate-800">
                                    {section.sectionName}
                                  </p>
                                  <div className="mt-2 space-y-2">
                                    {section.menuItems.slice(0, 5).map((item) => (
                                      <div key={item.name} className="text-sm text-slate-600">
                                        {item.name}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        description="Geoapify place details usually focus on contact, location, and category data rather than menu items."
                        title="No menu data was returned for this restaurant"
                      />
                    )}
                  </CardBody>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="border border-sky-100 bg-white">
                  <CardBody className="gap-4 p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700/80">
                        Contact info
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-900">External links</h2>
                    </div>
                    <div className="space-y-3">
                      {websiteUrl ? (
                        <a
                          className="flex items-center justify-between rounded-[1.25rem] border border-sky-100 bg-sky-50 px-4 py-3 text-sm font-medium text-sky-700 transition hover:border-sky-300"
                          href={websiteUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <span>Visit {getWebsiteLabel(websiteUrl)}</span>
                          <span>Open</span>
                        </a>
                      ) : (
                        <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
                          No validated website was provided by the API for this place.
                        </div>
                      )}

                      {mapUrl ? (
                        <a
                          className="flex items-center justify-between rounded-[1.25rem] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 transition hover:border-emerald-300"
                          href={mapUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <span>Open map location</span>
                          <span>Maps</span>
                        </a>
                      ) : null}
                    </div>
                  </CardBody>
                </Card>

                <Card className="border border-sky-100 bg-white">
                  <CardBody className="gap-4 p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700/80">
                        Attributes
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-900">
                        Helpful availability cues
                      </h2>
                    </div>
                    {restaurant.highlights.length ? (
                      <div className="flex flex-wrap gap-2">
                        {restaurant.highlights.map((highlight, index) => (
                          <Chip
                            key={highlight}
                            className={
                              index % 3 === 0
                                ? 'bg-sky-50 text-sky-700'
                                : index % 3 === 1
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-emerald-50 text-emerald-700'
                            }
                            variant="flat"
                          >
                            {highlight}
                          </Chip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">
                        No extra place attributes were returned.
                      </p>
                    )}
                  </CardBody>
                </Card>

                <Card className="border border-sky-100 bg-white">
                  <CardBody className="gap-4 p-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700/80">
                        Coordinates
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-slate-900">Geo data</h2>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                      <div className="rounded-[1.25rem] bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Latitude
                        </p>
                        <p className="mt-2 text-sm text-slate-800">
                          {restaurant.geo.lat ?? 'Unavailable'}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                          Longitude
                        </p>
                        <p className="mt-2 text-sm text-slate-800">
                          {restaurant.geo.lon ?? 'Unavailable'}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Link
                  className="inline-flex h-12 items-center justify-center rounded-full bg-sky-100 px-5 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
                  to="/"
                >
                  Return to discovery
                </Link>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
};
