import { Card, CardBody, CardFooter, Chip, Link } from '@heroui/react';
import { Link as RouterLink } from 'react-router-dom';

import { RestaurantSummary } from '../types/restaurant';
import {
  formatAddressPreview,
  formatCategoryLabel,
  formatCuisineList,
  formatHoursPreview,
  formatLocationLine,
  formatPhoneNumber,
  formatPriceRange,
  normalizeWebsiteUrl,
} from '../utils/formatters';
import { buildRestaurantDetailsPath } from '../utils/restaurant';

type RestaurantCardProps = {
  restaurant: RestaurantSummary;
};

export const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const websiteUrl = normalizeWebsiteUrl(restaurant.restaurantWebsite);
  const detailsPath = buildRestaurantDetailsPath(restaurant.restaurantId);
  const mapUrl =
    restaurant.geo.lat !== null && restaurant.geo.lon !== null
      ? `https://www.google.com/maps/search/?api=1&query=${restaurant.geo.lat},${restaurant.geo.lon}`
      : '';
  const cuisineLabel = restaurant.cuisines[0]
    ? formatCategoryLabel(restaurant.cuisines[0])
    : 'Restaurant';

  return (
    <Card className="h-full overflow-hidden border border-sky-100/90 bg-white/95 shadow-[0_18px_60px_rgba(15,23,42,0.09)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(37,99,235,0.14)]">
      <div className="h-1.5 bg-[linear-gradient(90deg,#38bdf8,#2563eb,#f59e0b)]" />

      <CardBody className="flex h-full gap-5 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="rounded-full bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            {cuisineLabel}
          </div>
          <div className="rounded-full bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700">
            Geoapify
          </div>
        </div>

        <div className="flex min-h-24 items-start justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-[1.75rem] font-semibold tracking-tight text-slate-900">
              {restaurant.restaurantName}
            </h3>
            <p className="text-sm text-slate-600">{formatLocationLine(restaurant)}</p>
          </div>
          {restaurant.priceRange ? (
            <Chip className="bg-sky-100 text-sky-800" variant="flat">
              {formatPriceRange(restaurant.priceRange)}
            </Chip>
          ) : null}
        </div>

        <div className="flex min-h-[3.5rem] flex-wrap content-start gap-2.5">
          {(restaurant.cuisines.length
            ? restaurant.cuisines.slice(0, 3)
            : ['Cuisine unavailable']
          ).map((cuisine, index) => (
            <Chip
              key={cuisine}
              className={
                index === 0
                  ? 'bg-sky-50 px-3 py-1 text-sky-700'
                  : index === 1
                    ? 'bg-violet-50 px-3 py-1 text-violet-700'
                    : 'bg-emerald-50 px-3 py-1 text-emerald-700'
              }
              size="sm"
              variant="flat"
            >
              {formatCategoryLabel(cuisine)}
            </Chip>
          ))}
        </div>

        <div className="grid min-h-[18.5rem] gap-4 rounded-[1.6rem] bg-[linear-gradient(180deg,#f8fbff,#f4f7fb)] p-4 text-sm text-slate-700">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/85 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Cuisine
              </p>
              <p className="mt-2 line-clamp-2 min-h-[3rem] text-sm font-medium leading-6 text-slate-900">
                {formatCuisineList(restaurant.cuisines)}
              </p>
            </div>

            <div className="rounded-2xl bg-white/85 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Hours
              </p>
              <p className="mt-2 min-h-[3rem] text-sm font-medium leading-6 text-slate-900">
                {formatHoursPreview(restaurant.hours)}
              </p>
            </div>
          </div>

          <div className="grid flex-1 gap-3">
            <div className="rounded-2xl bg-white/75 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Address
              </p>
              <p className="mt-2 min-h-[4.5rem] text-sm leading-7 text-slate-700">
                {formatAddressPreview(restaurant.address.formatted)}
              </p>
            </div>

            <div className="rounded-2xl bg-white/75 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Phone
              </p>
              <p className="mt-2 min-h-6 text-sm font-medium text-slate-700">
                {formatPhoneNumber(restaurant.restaurantPhone)}
              </p>
            </div>
          </div>

          {restaurant.highlights.length ? (
            <div className="flex min-h-[2.75rem] flex-wrap content-start gap-2 pt-1">
              {restaurant.highlights.slice(0, 3).map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200"
                >
                  {highlight}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </CardBody>

      <CardFooter className="grid grid-cols-3 gap-3 border-t border-slate-100 p-5">
        {websiteUrl ? (
          <Link
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 no-underline transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100"
            href={websiteUrl}
            isExternal
          >
            Website
          </Link>
        ) : (
          <button
            className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-400"
            disabled
            type="button"
          >
            Website
          </button>
        )}

        {mapUrl ? (
          <Link
            className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 no-underline transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-100"
            href={mapUrl}
            isExternal
          >
            Visit
          </Link>
        ) : (
          <button
            className="inline-flex h-11 cursor-not-allowed items-center justify-center rounded-full border border-slate-200 bg-slate-100 px-4 text-sm font-semibold text-slate-400"
            disabled
            type="button"
          >
            Visit
          </button>
        )}

        <RouterLink
          className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-[linear-gradient(135deg,#38bdf8,#2563eb)] px-5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(37,99,235,0.25)] transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-sky-100"
          to={detailsPath}
        >
          Details
        </RouterLink>
      </CardFooter>
    </Card>
  );
};
