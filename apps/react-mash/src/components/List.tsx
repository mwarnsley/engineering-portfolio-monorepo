import { ChangeEvent } from 'react';
import styled from 'styled-components';

import { colors } from '../styles/tokens';

const Row = styled.label`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 14px;
`;

const Number = styled.span`
  min-width: 2.25rem;
  color: ${colors.primary};
  font-size: 1.1rem;
  font-weight: 800;
`;

const Input = styled.input`
  width: 100%;
  padding: 15px 18px;
  border: 1px solid rgba(113, 88, 255, 0.18);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.86);
  color: ${colors.ink};
  transition: border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease;

  &::placeholder {
    color: rgba(111, 103, 145, 0.72);
  }

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 4px rgba(113, 88, 255, 0.14);
    transform: translateY(-1px);
  }
`;

interface ListProps {
  number: number;
  id: number;
  value: string;
  onChange: (inputId: number, event: ChangeEvent<HTMLInputElement>) => void;
}

const List = ({ number, onChange, id, value }: ListProps) => (
  <Row>
    <Number>{number}.</Number>
    <Input
      type="text"
      aria-label={`Option ${number}`}
      value={value}
      placeholder="Type your answer"
      onChange={(event) => onChange(id, event)}
    />
  </Row>
);

export default List;
