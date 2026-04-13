import { ChangeEvent } from 'react';
import styled from 'styled-components';

import { colors } from '../styles/tokens';
import { MashQuestion } from '../types/mash';
import List from './List';

const Section = styled.div`
  display: grid;
  gap: 20px;
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
  font-size: clamp(2rem, 4vw, 2.6rem);
  color: ${colors.ink};
`;

const Copy = styled.p`
  margin: 0;
  line-height: 1.7;
  color: ${colors.inkSoft};
`;

const ListStack = styled.div`
  display: grid;
  gap: 14px;
`;

interface ListContainerProps {
  question: MashQuestion;
  onInputChange: (inputId: number, event: ChangeEvent<HTMLInputElement>) => void;
}

const ListContainer = ({ question, onInputChange }: ListContainerProps) => (
  <Section>
    <div>
      <Eyebrow>Future category</Eyebrow>
      <Title>{question.title}</Title>
    </div>
    <Copy>Fill in all four choices for {question.title.toLowerCase()} before moving to the next category.</Copy>
    <ListStack>
      {question.inputs.map((input) => (
        <List key={input.id} number={input.id} id={input.id} value={input.value} onChange={onInputChange} />
      ))}
    </ListStack>
  </Section>
);

export default ListContainer;
