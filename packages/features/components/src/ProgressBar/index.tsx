import React, { PropsWithChildren, useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Flex, Button } from '@origyn/origyn-art-ui';
import { ErrorIcon } from '@dapp/common-assets';

export type ProgressError = {
  title: string;
  message: string;
  tryAgainAction: () => void;
  doneAction: () => void;
};

export type ProgressProps = {
  title: string;
  currentValue?: number;
  maxValue: number;
  message: string;
  successMessage: string;
  successAction: () => void;
  error?: ProgressError | null;
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

const StyleError = styled.div`
  margin-top: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.SECONDARY_TEXT};
  margin-top: 16px;
`;

const StyleContainerError = styled.div`
  width: 538px;
  left: 0px;
  top: 0px;
  border-radius: 8px;
  padding: 12px 16px 12px 16px;
  border-radius: 8px;
  background-color: #dd1422;
  color: #fefefe;
  margin-top: 32px;

  svg {
    color: #fefefe;
  }
`;

const BtnContainer = styled.div`
  margin-top: 32px;
`;
export const ProgressBar = ({
  title,
  currentValue,
  maxValue,
  message,
  successMessage,
  successAction,
  error,
}: PropsWithChildren<ProgressProps>) => {
  const progressLineContainer = useRef<HTMLDivElement>(null);
  const progressLine = useRef<HTMLDivElement>(null);
  const successMsg = useRef<HTMLDivElement>(null);
  const msg = useRef<HTMLDivElement>(null);
  const btnDone = useRef<HTMLButtonElement>(null);

  const [progressError, setProgressError] = useState<ProgressError | null>(null);

  const setLineProgress = () => {
    if (successMsg.current) {
      if (currentValue == maxValue) {
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

    const width = (currentValue / maxValue) * 100;
    if (progressLine.current) {
      progressLine.current.style.width = `${width}%`;
    }
  };

  useEffect(() => {
    if (currentValue > 0) {
      setLineProgress();
    }
  }, [currentValue]);

  useEffect(() => {
    if (error && error.title) {
      setProgressError(error);
    }
  }, [error]);

  return (
    <StyledProgressContainer>
      <>
        {progressError ? (
          <>
            <StyledProgressTitle>Error</StyledProgressTitle>
            <StyleError>{progressError.title}</StyleError>
            <StyleContainerError>
              <Flex align="flext-start" gap={12}>
                <Flex>
                  <ErrorIcon />
                </Flex>
                <Flex>
                  <div>{progressError.message}</div>
                </Flex>
              </Flex>
            </StyleContainerError>

            <BtnContainer>
              <Flex align="flex-end" justify="flex-end" gap={16}>
                <Button
                  size="large"
                  btnType="outlined"
                  ref={btnDone}
                  onClick={error.tryAgainAction}
                >
                  Try Again
                </Button>
                <Button size="large" btnType="filled" ref={btnDone} onClick={error.doneAction}>
                  Done
                </Button>
              </Flex>
            </BtnContainer>
          </>
        ) : (
          <>
            <StyledProgressTitle>{title}</StyledProgressTitle>
            <StyleSuccess ref={successMsg}>{successMessage}</StyleSuccess>
            <Flex align="center" justify="center">
              <StyledProgressMessage ref={msg}>
                {message ? message : `${currentValue} of ${maxValue}`}
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
      </>
    </StyledProgressContainer>
  );
};

export default ProgressBar;
