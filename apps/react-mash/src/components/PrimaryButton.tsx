import { ButtonHTMLAttributes, PropsWithChildren } from 'react';
import styled from 'styled-components';

const Button = styled.button`
  min-width: 190px;
  padding: 15px 26px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #7158ff 0%, #0fa3b1 100%);
  color: white;
  font-size: 0.98rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 18px 32px rgba(74, 61, 170, 0.24);
  transition: transform 160ms ease, box-shadow 160ms ease, filter 160ms ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 22px 38px rgba(74, 61, 170, 0.3);
    filter: saturate(1.05);
  }

  &:active {
    transform: translateY(0);
  }
`;

type PrimaryButtonProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

const PrimaryButton = ({ children, ...props }: PrimaryButtonProps) => <Button {...props}>{children}</Button>;

export default PrimaryButton;
