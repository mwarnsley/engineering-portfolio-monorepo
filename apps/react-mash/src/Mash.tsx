import { ChangeEvent, useMemo, useState } from 'react';
import styled from 'styled-components';

import Header from './components/Header';
import ListContainer from './components/ListContainer';
import PrimaryButton from './components/PrimaryButton';
import Results from './components/Results';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { advanceQuestionState, resetGame, setResults, setSelectedNumber, updateInputValue } from './store';
import { colors, globalStyles } from './styles/tokens';
import { MashQuestion, MashQuestionResult, MashStep } from './types/mash';

const MashShell = styled.main`
  ${globalStyles}
`;

const Layout = styled.div`
  min-height: 100vh;
  padding: 32px 20px 56px;
`;

const Frame = styled.div`
  width: min(1120px, 100%);
  margin: 0 auto;
`;

const ContentCard = styled.section<{ $wide: boolean }>`
  width: min(${({ $wide }) => ($wide ? '100%' : '540px')}, 100%);
  margin: 0 auto;
  padding: ${({ $wide }) => ($wide ? '28px' : '32px')};
  border: 1px solid rgba(113, 88, 255, 0.18);
  border-radius: 32px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.95), rgba(240, 246, 255, 0.88)),
    rgba(255, 255, 255, 0.92);
  box-shadow:
    0 26px 70px rgba(45, 34, 102, 0.16),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(18px);
`;

const NumberPrompt = styled.div`
  display: grid;
  gap: 18px;
`;

const PromptLabel = styled.label`
  font-size: 0.92rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.inkSoft};
`;

const NumberSelect = styled.select`
  width: 100%;
  padding: 16px 18px;
  border: 1px solid rgba(113, 88, 255, 0.2);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.9);
  color: ${colors.ink};
  font: inherit;
  outline: none;
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;

  &:focus {
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(113, 88, 255, 0.14);
    transform: translateY(-1px);
  }
`;

const ErrorText = styled.p`
  min-height: 1.5rem;
  margin: 0;
  color: ${colors.error};
  font-size: 0.95rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 28px;
`;

const stepByQuestionTitle: Record<MashQuestion['title'], MashStep> = {
  Crushes: 'Crushes',
  Careers: 'Careers',
  Pets: 'Pets',
  Vehicles: 'Vehicles',
  Kids: 'Kids',
  Honeymoon: 'Honeymoon',
};

const calculateMashResults = (questions: MashQuestion[], selectedNumber: number): MashQuestionResult[] => {
  const totalQuestionAnswers = questions.map((question) => question.inputs.map((input) => input.value));

  const results = totalQuestionAnswers.map((questionAnswers, groupIndex) => {
    const positions = questionAnswers.map((_, index) => {
      let candidate = 4 * groupIndex + index + 1;

      while (candidate % selectedNumber !== 0 && candidate <= 140) {
        candidate += 28;
      }

      return candidate;
    });

    const lowestIndex = positions.reduce((lowest, value, index) => (value < positions[lowest] ? index : lowest), 0);

    return questionAnswers[lowestIndex];
  });

  return questions.map((question, index) => ({
    title: question.title,
    value: results[index],
  }));
};

const Mash = () => {
  const dispatch = useAppDispatch();
  const { questions, questionState, storedQuestionState, selectOptions, selectedNumber, results } = useAppSelector(
    (state) => state.game,
  );
  const [selectionError, setSelectionError] = useState('');

  const activeQuestion = useMemo(
    () => questions.find((question) => stepByQuestionTitle[question.title] === questionState),
    [questionState, questions],
  );

  const isResultsStep = questionState === 'Results';

  const buttonText = useMemo(() => {
    const previousStep = storedQuestionState[storedQuestionState.length - 2];

    if (questionState === 'Results') {
      return 'Restart';
    }

    if (previousStep === questionState) {
      return 'Reveal My Future';
    }

    return 'Next';
  }, [questionState, storedQuestionState]);

  const handleInputChange = (inputId: number, event: ChangeEvent<HTMLInputElement>) => {
    if (!activeQuestion) {
      return;
    }

    dispatch(
      updateInputValue({
        questionTitle: activeQuestion.title,
        inputId,
        value: event.target.value,
      }),
    );
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextValue = Number(event.target.value);

    if (!Number.isNaN(nextValue) && nextValue > 0) {
      setSelectionError('');
      dispatch(setSelectedNumber(nextValue));
    }
  };

  const handleAdvance = () => {
    if (questionState === 'Results') {
      setSelectionError('');
      dispatch(resetGame());
      return;
    }

    if (questionState === 'Number') {
      if (!selectedNumber) {
        setSelectionError('Pick a number first so we can calculate your MASH outcome.');
        return;
      }

      dispatch(setResults(calculateMashResults(questions, selectedNumber)));
      dispatch(advanceQuestionState());
      return;
    }

    dispatch(advanceQuestionState());
  };

  return (
    <MashShell>
      <Layout>
        <Frame>
          <Header />
          <ContentCard $wide={isResultsStep}>
            {activeQuestion ? (
              <ListContainer question={activeQuestion} onInputChange={handleInputChange} />
            ) : null}

            {questionState === 'Number' ? (
              <NumberPrompt>
                <PromptLabel htmlFor="mash-number">Choose the number that drives the final count.</PromptLabel>
                <NumberSelect
                  id="mash-number"
                  aria-label="Select a MASH number"
                  value={selectedNumber ?? ''}
                  onChange={handleSelectChange}
                >
                  <option value="">Select a number</option>
                  {selectOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </NumberSelect>
                <ErrorText>{selectionError}</ErrorText>
              </NumberPrompt>
            ) : null}

            {isResultsStep ? <Results results={results} /> : null}
          </ContentCard>

          <ButtonRow>
            <PrimaryButton type="button" onClick={handleAdvance}>
              {buttonText}
            </PrimaryButton>
          </ButtonRow>
        </Frame>
      </Layout>
    </MashShell>
  );
};

export default Mash;
