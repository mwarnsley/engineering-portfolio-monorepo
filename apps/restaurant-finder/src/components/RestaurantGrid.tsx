import { RestaurantCard } from './RestaurantCard';
import { RestaurantSummary } from '../types/restaurant';

type RestaurantGridProps = {
  restaurants: RestaurantSummary[];
};

export const RestaurantGrid = ({ restaurants }: RestaurantGridProps) => {
  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.restaurantId} restaurant={restaurant} />
      ))}
    </div>
  );
};
