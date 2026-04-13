export const questionTitles = ['Crushes', 'Careers', 'Pets', 'Vehicles', 'Kids', 'Honeymoon'] as const;

export type MashQuestionTitle = (typeof questionTitles)[number];
export type MashStep = MashQuestionTitle | 'Number' | 'Results';

export interface MashInput {
  id: number;
  group: number;
  value: string;
}

export interface MashQuestion {
  id: number;
  title: MashQuestionTitle;
  inputs: MashInput[];
}

export interface MashQuestionResult {
  title: MashQuestionTitle;
  value: string;
}

export interface MashState {
  storedQuestionState: MashStep[];
  questionState: MashStep;
  questionStateIndex: number;
  questions: MashQuestion[];
  selectOptions: number[];
  selectedNumber: number | null;
  results: MashQuestionResult[];
}
