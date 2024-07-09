import React, { PropsWithChildren, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Flex, Button } from '@origyn/origyn-art-ui';
import { ErrorIcon } from '@dapp/common-assets';

export type ProgressProps = {
  title: string;
  message: string;
  isError?: boolean;
  currentValue: number;
  maxValue: number;
  doneAction: Function;
  tryAgainAction?: Function;
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
  isError,
  message,
  maxValue,
  doneAction,
  tryAgainAction,
}: PropsWithChildren<ProgressProps>) => {
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [showProgressLine, setShowProgressLine] = useState(true);
  const [showBtnDone, setShowBtnDone] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const [progressWidth, setProgressWidth] = useState(0);

  const [progressError, setProgressError] = useState<boolean>(false);
  const setLineProgress = () => {
    if (currentValue == maxValue) {
      setShowSuccessMsg(true);
      setShowProgressLine(false);
      setShowBtnDone(true);
    } else {
      setShowSuccessMsg(false);
      setShowProgressLine(true);
      setShowBtnDone(false);
    }
    setProgressWidth((currentValue / maxValue) * 100);
  };

  useEffect(() => {
    if (currentValue > 0) {
      setLineProgress();
    }
  }, [currentValue]);

  useEffect(() => {
    if (isError === true) {
      setProgressError(true);
    }
  }, [isError]);

  useEffect(() => {
    if (message) {
      setStatusMessage(message);
    }
  }, [message]);

  return (
    <StyledProgressContainer>
      <>
        <StyledProgressTitle>{title}</StyledProgressTitle>
        {progressError ? (
          <StyleContainerError>
            <Flex align="flext-start" gap={12}>
              <Flex>
                <ErrorIcon />
              </Flex>
              <Flex>{statusMessage}</Flex>
            </Flex>
          </StyleContainerError>
        ) : (
          <>
            {showSuccessMsg && <StyleSuccess>{statusMessage}</StyleSuccess>}
            <Flex align="center" justify="center">
              {!showSuccessMsg && <StyledProgressMessage>{statusMessage}</StyledProgressMessage>}
            </Flex>
            {showProgressLine && (
              <StyleProgressLineContainer>
                <StyleProgressLine
                  style={{ width: `${progressWidth}%` }}
                  onClick={setLineProgress}
                />
              </StyleProgressLineContainer>
            )}
          </>
        )}
        {(showBtnDone || progressError) && (
          <Flex align="flex-end" justify="flex-end" gap={16}>
            <Flex>
              {tryAgainAction && progressError && (
                <BtnContainer>
                  <Button size="large" btnType="outlined" onClick={tryAgainAction}>
                    Try Again
                  </Button>
                </BtnContainer>
              )}
            </Flex>
            <Flex>
              <BtnContainer>
                <Button size="large" btnType="filled" onClick={doneAction}>
                  Done
                </Button>
              </BtnContainer>
            </Flex>
          </Flex>
        )}
      </>
    </StyledProgressContainer>
  );
};
