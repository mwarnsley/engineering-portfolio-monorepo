import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { MashQuestion, MashQuestionResult, MashQuestionTitle, MashState, MashStep, questionTitles } from '../types/mash';

export { questionTitles } from '../types/mash';

const steps: MashStep[] = [...questionTitles, 'Number', 'Results'];

const createQuestions = (): MashQuestion[] =>
  questionTitles.map((title, groupIndex) => ({
    id: groupIndex + 1,
    title,
    inputs: Array.from({ length: 4 }, (_, inputIndex) => ({
      id: inputIndex + 1,
      group: groupIndex + 1,
      value: '',
    })),
  }));

const createInitialState = (): MashState => ({
  storedQuestionState: steps,
  questionState: questionTitles[0],
  questionStateIndex: 1,
  questions: createQuestions(),
  selectOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  selectedNumber: null,
  results: [],
});

const gameSlice = createSlice({
  name: 'game',
  initialState: createInitialState(),
  reducers: {
    advanceQuestionState: (state) => {
      if (state.questionStateIndex >= state.storedQuestionState.length) {
        return;
      }

      state.questionState = state.storedQuestionState[state.questionStateIndex];
      state.questionStateIndex += 1;
    },
    updateInputValue: (
      state,
      action: PayloadAction<{ questionTitle: MashQuestionTitle; inputId: number; value: string }>,
    ) => {
      const { questionTitle, inputId, value } = action.payload;
      const question = state.questions.find((entry) => entry.title === questionTitle);

      if (!question) {
        return;
      }

      const input = question.inputs.find((entry) => entry.id === inputId);

      if (input) {
        input.value = value;
      }
    },
    setSelectedNumber: (state, action: PayloadAction<number>) => {
      state.selectedNumber = action.payload;
    },
    setResults: (state, action: PayloadAction<MashQuestionResult[]>) => {
      state.results = action.payload;
    },
    resetGame: () => createInitialState(),
  },
});

export const { advanceQuestionState, resetGame, setResults, setSelectedNumber, updateInputValue } = gameSlice.actions;
export default gameSlice.reducer;
