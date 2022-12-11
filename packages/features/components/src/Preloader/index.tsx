import React from 'react';
import styled from 'styled-components';

const StyledPreloader = styled.div`
  width: ${({ width }) => width || '100vw'};
  height: ${({ height }) => height || '100vh'};
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme?.colors?.BACKGROUND};

  svg {
    stroke-dasharray: 450;
    stroke-dashoffset: 450;
    animation: spin 2s linear forwards;
    animation-iteration-count: infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const Preloader = (props) => (
  <StyledPreloader {...props}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35"
      height="32"
      viewBox="0 0 35 32"
      fill="none"
    >
      <path
        d="M4.10997 7.76894C3.84676 7.76893 3.59424 7.87119 3.40753 8.05339C3.22082 8.23559 3.11508 8.48293 3.1134 8.74142V20.5813C3.11459 22.0855 3.72006 23.5285 4.79827 24.5967C5.87648 25.665 7.34035 26.2723 8.87185 26.2867H10.2721C9.91046 26.2706 9.56904 26.1182 9.31888 25.8612C9.06873 25.6042 8.92911 25.2623 8.92907 24.9068V8.74142C8.92907 8.48185 8.82407 8.2329 8.63718 8.04936C8.45029 7.86581 8.19681 7.7627 7.93251 7.7627L4.10997 7.76894Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M3.11341 20.5859V25.4655C3.11236 26.3235 3.28358 27.1733 3.61728 27.9662C3.95097 28.7591 4.44058 29.4796 5.05809 30.0865C5.67561 30.6934 6.40892 31.1748 7.21605 31.5031C8.02319 31.8314 8.88831 32.0001 9.76193 31.9997H23.2195C24.6762 31.8843 26.0352 31.2342 27.0258 30.1789C28.0164 29.1237 28.5658 27.7406 28.5647 26.3053V24.9004C28.5618 25.2677 28.411 25.6189 28.1454 25.8774C27.8798 26.1359 27.5209 26.2808 27.1469 26.2803L10.2753 26.2913H8.93225C7.39054 26.2921 5.91161 25.6915 4.82071 24.6216C3.72981 23.5517 3.11626 22.1001 3.115 20.5859H3.11341Z"
        fill="url(#paint1_linear)"
      />
      <path
        d="M10.3054 0H1.90852C1.67558 0.00644621 1.45425 0.101256 1.29096 0.264532C1.12767 0.427808 1.03513 0.646855 1.03275 0.875702C0.976704 2.16284 0.752893 3.43761 0.36679 4.66885C0.217385 5.18397 0.552751 5.72406 1.09792 5.72406H27.1405C31.0536 5.76308 34.3771 8.86784 34.3771 12.789V6.54513C34.3774 5.23139 33.9748 3.94801 33.2218 2.86217C32.4689 1.77632 31.4004 0.938335 30.1556 0.457363L30.1047 0.43707H30.0841C29.3284 0.150623 28.5258 0.00248954 27.7158 0L10.3054 0Z"
        fill="url(#paint2_linear)"
      />
      <path
        d="M28.5583 7.10899V26.2839C28.5603 27.7182 28.0119 29.1007 27.0225 30.1557C26.0331 31.2107 24.6752 31.8609 23.2195 31.9767C23.0605 31.9892 22.9111 31.9955 22.7554 31.9955H27.7239C28.5974 31.9965 29.4625 31.8283 30.2698 31.5004C31.077 31.1725 31.8104 30.6914 32.428 30.0848C33.0456 29.4781 33.5352 28.7577 33.8689 27.9648C34.2026 27.172 34.3737 26.3223 34.3724 25.4644V12.8362C34.372 10.9548 33.6123 9.15019 32.2598 7.81778C30.9073 6.48536 29.0722 5.73373 27.1565 5.72754C27.5279 5.73001 27.8832 5.87665 28.1449 6.13545C28.4067 6.39426 28.5536 6.74423 28.5536 7.10899"
        fill="url(#paint3_linear)"
      />
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="6.69435"
          y1="7.76894"
          x2="6.69435"
          y2="26.2929"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.03" stopColor="#04612A" />
          <stop offset="0.3" stopColor="#037E34" />
          <stop offset="0.33" stopColor="#138736" />
          <stop offset="0.4" stopColor="#2E963A" />
          <stop offset="0.47" stopColor="#41A13C" />
          <stop offset="0.55" stopColor="#4CA83E" />
          <stop offset="0.63" stopColor="#50AA3E" />
          <stop offset="0.72" stopColor="#57AC38" />
          <stop offset="0.87" stopColor="#6CB026" />
          <stop offset="0.91" stopColor="#73B220" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="28.5695"
          y1="26.2913"
          x2="3.11341"
          y2="26.2913"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.03" stopColor="#15A0D7" />
          <stop offset="0.3" stopColor="#1170B3" />
          <stop offset="0.36" stopColor="#185CA4" />
          <stop offset="0.45" stopColor="#1E4995" />
          <stop offset="0.54" stopColor="#223E8C" />
          <stop offset="0.63" stopColor="#233A89" />
          <stop offset="0.69" stopColor="#223782" />
          <stop offset="0.78" stopColor="#1F306D" />
          <stop offset="0.89" stopColor="#1B234C" />
          <stop offset="0.91" stopColor="#1A2146" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="3.60125"
          y1="-3.71354"
          x2="33.6825"
          y2="13.9698"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F3E520" />
          <stop offset="0.44" stopColor="#F5A506" />
          <stop offset="0.57" stopColor="#EB5F11" />
          <stop offset="0.68" stopColor="#E42E18" />
          <stop offset="0.73" stopColor="#E11B1B" />
          <stop offset="0.85" stopColor="#E0121C" />
          <stop offset="1" stopColor="#E00C1D" />
        </linearGradient>
        <linearGradient
          id="paint3_linear"
          x1="28.5679"
          y1="31.9986"
          x2="28.5679"
          y2="5.72754"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#272B74" />
          <stop offset="0.05" stopColor="#2F2D76" />
          <stop offset="0.14" stopColor="#45317A" />
          <stop offset="0.24" stopColor="#683881" />
          <stop offset="0.29" stopColor="#7A3C85" />
          <stop offset="0.33" stopColor="#7E3083" />
          <stop offset="0.4" stopColor="#832080" />
          <stop offset="0.46" stopColor="#851A7F" />
          <stop offset="0.55" stopColor="#862682" />
          <stop offset="0.66" stopColor="#872E84" />
          <stop offset="0.71" stopColor="#852D80" />
          <stop offset="0.76" stopColor="#7F2973" />
          <stop offset="0.81" stopColor="#74225E" />
          <stop offset="0.86" stopColor="#651841" />
          <stop offset="0.91" stopColor="#550E21" />
          <stop offset="1" stopColor="#550E21" />
        </linearGradient>
      </defs>
    </svg>
  </StyledPreloader>
);
