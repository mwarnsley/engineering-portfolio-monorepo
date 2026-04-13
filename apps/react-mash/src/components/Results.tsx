import styled from 'styled-components';

import { colors } from '../styles/tokens';
import { MashQuestionResult } from '../types/mash';

const Section = styled.section`
  display: grid;
  gap: 18px;
`;

const Eyebrow = styled.p`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${colors.secondary};
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(2rem, 4vw, 2.8rem);
`;

const Subtitle = styled.p`
  margin: 0;
  line-height: 1.7;
  color: ${colors.inkSoft};
`;

const Grid = styled.div`
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

const ResultCard = styled.article<{ $accent: string }>`
  padding: 22px;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(245, 249, 255, 0.88)),
    ${({ $accent }) => `${$accent}18`};
  border: 1px solid ${({ $accent }) => `${$accent}33`};
  box-shadow: 0 18px 36px rgba(50, 36, 108, 0.08);
`;

const ResultTitle = styled.h3<{ $accent: string }>`
  margin: 0 0 10px;
  color: ${({ $accent }) => $accent};
  font-size: 1.12rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const ResultValue = styled.p`
  margin: 0;
  color: ${colors.ink};
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.4;
`;

interface ResultsProps {
  results: MashQuestionResult[];
}

const Results = ({ results }: ResultsProps) => (
  <Section>
    <div>
      <Eyebrow>Your MASH future</Eyebrow>
      <Title>Results</Title>
    </div>
    <Subtitle>Here’s the story the game picked from the options you entered.</Subtitle>
    <Grid>
      {results.map((result) => (
        <ResultCard key={result.title} $accent={colors.accents[result.title]}>
          <ResultTitle $accent={colors.accents[result.title]}>{result.title}</ResultTitle>
          <ResultValue>{result.value || 'No answer entered'}</ResultValue>
        </ResultCard>
      ))}
    </Grid>
  </Section>
);

export default Results;
