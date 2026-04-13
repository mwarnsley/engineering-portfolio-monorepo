import { configureStore } from '@reduxjs/toolkit';

import gameReducer, {
  advanceQuestionState,
  resetGame,
  setResults,
  setSelectedNumber,
  updateInputValue,
} from './gameSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { advanceQuestionState, resetGame, setResults, setSelectedNumber, updateInputValue };
