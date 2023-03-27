import React, { PropsWithChildren, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Flex, Button } from '@origyn/origyn-art-ui';

export type ProgressProps = {
  title: string;
  currentProgressIndex?: number;
  progressLength: number;
  progressMessage: string;
  successMessage: string;
  successAction: () => void;
};

const StyledProgressContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.BACKGROUND};
  color: ${({ theme }) => theme.colors.TEXT};
  width: 550px;
`;
const StyledProgressTitle = styled.div`
  font-size: 28px;
  color: ${({ theme }) => theme.colors.TEXT};
`;
const StyledProgressMessage = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  margin-top: 32px;
`;
const StyleProgressLineContainer = styled.div`
  padding: 2px;
  width: 538px;
  height: 6px;
  background-color: #242424;
  margin-top: 16px;
  border-radius: 999px;
`;
const StyleProgressLine = styled.div`
  height: 6px;
  background-color: #e3e3e3;
  border-radius: 0px 999px 999px 0px;
`;
const StyleSuccess = styled.div`
  margin-top: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  margin-top: 16px;
`;
const BtnContainer = styled.div`
  margin-top: 32px;
`;
export const ProgressBar = ({
  title,
  currentProgressIndex,
  progressLength,
  progressMessage,
  successMessage,
  successAction,
}: PropsWithChildren<ProgressProps>) => {
  const progressLineContainer = useRef<HTMLDivElement>(null);
  const progressLine = useRef<HTMLDivElement>(null);
  const successMsg = useRef<HTMLDivElement>(null);
  const msg = useRef<HTMLDivElement>(null);
  const btnDone = useRef<HTMLButtonElement>(null);

  const setLineProgress = () => {
    if (successMsg.current) {
      if (currentProgressIndex == progressLength) {
        msg.current.style.display = 'none';
        progressLine.current.style.display = 'none';
        progressLineContainer.current.style.display = 'none';

        successMsg.current.style.display = 'block';
        btnDone.current.style.display = 'block';
      } else {
        successMsg.current.style.display = 'none';
        btnDone.current.style.display = 'none';

        msg.current.style.display = 'block';
        progressLine.current.style.display = 'block';
        progressLineContainer.current.style.display = 'block';
      }
    }

    const width = (currentProgressIndex / progressLength) * 100;
    if (progressLine.current) {
      progressLine.current.style.width = `${width}%`;
    }
  };

  useEffect(() => {
    if (currentProgressIndex > 0) {
      setLineProgress();
    }
  }, [currentProgressIndex, open]);

  return (
    <StyledProgressContainer>
      <StyledProgressTitle>{title}</StyledProgressTitle>
      {currentProgressIndex > 0 && (
        <>
          <StyleSuccess ref={successMsg}>{successMessage}</StyleSuccess>
          <Flex align="center" justify="center">
            <StyledProgressMessage ref={msg}>
              {progressMessage ? progressMessage : `${currentProgressIndex} of ${progressLength}`}
            </StyledProgressMessage>
          </Flex>
          <Flex align="flex-end" justify="flex-end">
            <BtnContainer>
              <Button size="large" btnType="filled" ref={btnDone} onClick={successAction}>
                Done
              </Button>
            </BtnContainer>
          </Flex>
          <StyleProgressLineContainer ref={progressLineContainer}>
            <StyleProgressLine onClick={setLineProgress} ref={progressLine} />
          </StyleProgressLineContainer>
        </>
      )}
    </StyledProgressContainer>
  );
};

export default ProgressBar;
