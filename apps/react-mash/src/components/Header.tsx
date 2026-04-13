import styled from 'styled-components';

import { colors } from '../styles/tokens';

const HeaderShell = styled.header`
  padding: 28px 0 30px;
  text-align: center;
`;

const HeroCard = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 36px;
  padding: 40px 24px;
  background:
    radial-gradient(circle at 20% 15%, rgba(255, 255, 255, 0.2), transparent 25%),
    linear-gradient(135deg, #2f225f 0%, #7158ff 42%, #0fa3b1 100%);
  box-shadow: 0 28px 80px rgba(32, 18, 83, 0.28);
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(4rem, 11vw, 7rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: white;
`;

const Letter = styled.span<{ $tone: string }>`
  color: ${({ $tone }) => $tone};
  text-shadow: 0 8px 22px rgba(20, 18, 33, 0.18);
`;

const Subtitle = styled.div`
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(1rem, 2.8vw, 1.35rem);
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const SubtitleWord = styled.span<{ $tone: string }>`
  color: ${({ $tone }) => $tone};
  font-weight: 700;
`;

const HelperText = styled.p`
  width: min(700px, 100%);
  margin: 18px auto 0;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.88);
`;

const Header = () => (
  <HeaderShell>
    <HeroCard>
      <Title>
        <Letter $tone={colors.accents.Crushes}>M</Letter>
        <Letter $tone={colors.accents.Careers}>A</Letter>
        <Letter $tone={colors.accents.Pets}>S</Letter>
        <Letter $tone={colors.accents.Vehicles}>H</Letter>
      </Title>
      <Subtitle>
        <SubtitleWord $tone={colors.accents.Crushes}>Mansion</SubtitleWord>
        <SubtitleWord $tone={colors.accents.Careers}>Apartment</SubtitleWord>
        <SubtitleWord $tone={colors.accents.Pets}>Shack</SubtitleWord>
        <SubtitleWord $tone={colors.accents.Vehicles}>House</SubtitleWord>
      </Subtitle>
      <HelperText>
        Fill in each list, pick a number, and let the classic MASH formula decide your imaginary future.
      </HelperText>
    </HeroCard>
  </HeaderShell>
);

export default Header;
