import React, {useContext} from "react"
import { Box } from "@mui/material"
import { SiteContext } from "@dapp/features-theme";

function Logo() {
  const { themeMode } = useContext(SiteContext);
  return (
    <Box sx={{ width: 220, height: 50 }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 110 25"
      >
        <g clipPath="url(#prefix__clip0)">
          <path
            d="M2.886 6.07a.76.76 0 00-.762.764v9.251c0 1.175.463 2.303 1.287 3.137a4.429 4.429 0 003.112 1.32h1.073a1.076 1.076 0 01-.73-.332c-.193-.2-.3-.468-.302-.746V6.834a.767.767 0 00-.76-.765H2.885z"
            fill="url(#foundation0_linear)"
          ></path>
          <path
            d="M2.124 16.084v3.812a5.12 5.12 0 001.487 3.609 5.076 5.076 0 003.593 1.494h10.284a4.432 4.432 0 002.907-1.423 4.47 4.47 0 001.175-3.026v-1.096a1.09 1.09 0 01-.32.764 1.08 1.08 0 01-.763.315L7.6 20.541h-1.03a4.431 4.431 0 01-3.14-1.305 4.471 4.471 0 01-1.303-3.152h-.002z"
            fill="url(#foundation1_linear)"
          ></path>
          <path
            d="M7.62 0H1.204c-.374 0-.65.31-.67.684a11.895 11.895 0 01-.507 2.963c-.114.403.141.826.558.826H20.48c2.989.03 5.528 2.456 5.528 5.52V5.11c0-1.027-.308-2.03-.884-2.878A5.093 5.093 0 0022.781.353l-.04-.015-.015-.006A5.038 5.038 0 0020.92 0H7.62z"
            fill="url(#foundation2_linear)"
          ></path>
          <path
            d="M21.562 5.554h.006v14.98a4.472 4.472 0 01-1.175 3.027 4.433 4.433 0 01-3.262 1.437h3.795a5.056 5.056 0 003.594-1.493 5.098 5.098 0 001.486-3.61V10.03c0-1.47-.58-2.88-1.613-3.922a5.516 5.516 0 00-3.899-1.632c.284.002.555.116.755.318.2.203.312.476.312.76"
            fill="url(#foundation3_linear)"
          ></path>
          <g>
            <path
              d="M61.627 1.704h1.997a.167.167 0 01.167.168v12.99a.168.168 0 01-.167.166h-1.997a.165.165 0 01-.162-.167V1.872a.168.168 0 01.102-.155.166.166 0 01.064-.013M67.401 8.405v-.038c0-3.73 2.843-6.891 6.842-6.891 2.239 0 3.643.606 4.968 1.7a.17.17 0 01.022.238l-1.26 1.513a.168.168 0 01-.235.02c-.98-.813-1.97-1.32-3.586-1.32-2.445 0-4.303 2.151-4.303 4.702v.038c0 2.741 1.801 4.759 4.51 4.759a5.449 5.449 0 003.074-.918.311.311 0 00.13-.254v-3.48a.168.168 0 01.166-.167h1.918a.166.166 0 01.175.17v4.458a.532.532 0 01-.199.415 8.407 8.407 0 01-5.334 1.91c-4.155-.002-6.888-2.967-6.888-6.855zM87.22 9.642l-5.014-7.678a.167.167 0 01.139-.26h2.275a.333.333 0 01.282.157l3.457 5.504a.167.167 0 00.22.058.166.166 0 00.061-.058l3.513-5.504a.332.332 0 01.28-.155h2.185a.167.167 0 01.167.176.169.169 0 01-.028.085l-5.01 7.62a.538.538 0 00-.091.295v4.98a.167.167 0 01-.166.166h-2.018a.165.165 0 01-.154-.103.168.168 0 01-.013-.064V9.935a.544.544 0 00-.087-.294M98.203 1.704h1.796a.394.394 0 01.317.156l6.748 8.748a.135.135 0 00.214-.005.135.135 0 00.025-.077V1.872c0-.044.017-.087.049-.118a.165.165 0 01.118-.05h1.959a.166.166 0 01.167.168v12.99a.17.17 0 01-.103.155.17.17 0 01-.064.011h-1.588a.4.4 0 01-.317-.155l-6.956-9.015a.133.133 0 00-.239.083v8.92a.168.168 0 01-.167.167h-1.96a.167.167 0 01-.167-.167V1.872a.168.168 0 01.168-.168zM54.547 10.103a.105.105 0 01.013-.135.104.104 0 01.042-.025c1.765-.558 3.007-1.86 3.007-3.993v-.039c0-1.16-.398-2.15-1.096-2.874-.853-.837-2.16-1.333-3.828-1.333H48.14a.166.166 0 00-.166.168V3.67a.167.167 0 00.102.155c.02.008.042.013.064.012h4.35c1.726 0 2.749.781 2.749 2.208v.039c0 1.351-1.061 2.227-2.728 2.227h-2.717a.166.166 0 00-.166.167v1.743a.169.169 0 00.048.118.165.165 0 00.117.05h2.02a.394.394 0 01.323.166l3.026 4.307a.39.39 0 00.32.165h2.238a.165.165 0 00.143-.088.168.168 0 00-.006-.168l-3.311-4.667zM33.681 8.348V8.31c0-3.785 2.908-6.954 7.02-6.954 4.11 0 6.98 3.132 6.98 6.915v.04c0 3.784-2.907 6.953-7.02 6.953-4.11 0-6.98-3.135-6.98-6.916zm11.533 0V8.31c0-2.613-1.893-4.784-4.552-4.784s-4.513 2.133-4.513 4.745v.04c0 2.611 1.893 4.763 4.551 4.763 2.659 0 4.514-2.11 4.514-4.726zM36.434 20.28h2.142v.767h-2.142v1.984h-.923v-4.83h3.18v.767h-2.257v1.311zM42.925 18.317c.433.195.679.543.772 1.108.036.218.051.5.051 1.144 0 1.159-.044 1.477-.246 1.84-.172.304-.49.514-.922.601a5.883 5.883 0 01-1.046.065c-.714 0-1.074-.058-1.37-.217-.382-.21-.577-.522-.663-1.058-.036-.224-.044-.459-.044-1.057 0-1.245.051-1.6.274-1.955a1.353 1.353 0 01.894-.566 5.735 5.735 0 011.017-.065c.683 0 1 .044 1.283.16zm-2.53 2.498c0 .848.036 1.065.21 1.268.136.16.352.195 1.088.195.706 0 .9-.08 1.024-.427.086-.239.091-.363.091-1.267 0-.76 0-.783-.035-1.01-.044-.282-.16-.464-.34-.543-.158-.065-.338-.08-.879-.08-.584 0-.779.037-.93.184-.152.148-.224.406-.23.884l.001.796zM48.77 18.201v3.216c0 .593-.072.917-.252 1.158-.16.203-.38.347-.627.413-.183.058-.563.087-1.118.087-.707 0-1.031-.036-1.313-.16-.518-.224-.685-.572-.685-1.448v-3.266h.924v3.265c0 .703.144.811 1.081.811.937 0 1.067-.1 1.067-.847v-3.229h.923zM54.44 23.031h-1.553l-1.377-2.65c-.086-.183-.182-.377-.468-1.043l-.158-.34h-.03l.008.31c.022.465.022.5.022.95v2.773h-.91v-4.83h1.545l1.255 2.448c.183.362.239.485.563 1.18l.182.399h.03l-.008-.312c-.022-.449-.022-.485-.022-.934v-2.78h.914l.007 4.83zM55.645 18.201h2.374c.664 0 1.083.13 1.356.413.346.354.462.768.462 1.607 0 1.304-.044 1.702-.202 2.043-.267.529-.75.767-1.587.767h-2.403v-4.83zm2.22 4.037c.44 0 .686-.087.83-.29.158-.225.201-.514.201-1.34 0-.827-.036-1.115-.183-1.325-.137-.195-.365-.275-.785-.275h-1.36v3.23h1.298zM61.637 22.108l-.295.927h-.966l1.6-4.83h1.362l1.63 4.83h-.946l-.308-.927h-2.077zm1.038-3.194l-.822 2.506h1.651l-.829-2.506zM67.247 23.031h-.923v-4.019h-1.388v-.81h3.734v.81h-1.423v4.02zM70.442 23.031h-.923v-4.83h.923v4.83zM74.955 18.317c.433.195.678.543.772 1.108.036.218.05.5.05 1.144 0 1.159-.043 1.477-.245 1.84-.173.304-.49.514-.923.601a5.865 5.865 0 01-1.045.065c-.714 0-1.075-.058-1.37-.217-.382-.21-.577-.522-.663-1.058-.037-.224-.044-.458-.044-1.057 0-1.245.05-1.6.275-1.955a1.35 1.35 0 01.893-.566 5.728 5.728 0 011.017-.065c.685 0 1.002.044 1.283.16zm-2.53 2.498c0 .848.035 1.065.209 1.268.137.16.353.195 1.088.195.707 0 .902-.08 1.024-.427.092-.239.092-.363.092-1.267 0-.76 0-.783-.037-1.01-.043-.282-.159-.464-.339-.543-.159-.065-.339-.08-.88-.08-.583 0-.778.037-.93.184-.152.148-.223.406-.23.884l.003.796zM81.284 23.031H79.73l-1.37-2.65a18.978 18.978 0 01-.468-1.043l-.16-.34h-.029l.008.31c.022.465.022.5.022.95v2.773h-.914v-4.83h1.544l1.254 2.448c.183.362.238.485.563 1.18l.182.399h.03l-.008-.312c-.022-.449-.022-.485-.022-.934v-2.78h.913l.008 4.83z"
              fill={themeMode === "light" ? "#222" : "#fff"}
            ></path>
          </g>
        </g>
        <defs>
          <linearGradient
            id="foundation0_linear"
            x1="4.861"
            y1="6.069"
            x2="4.861"
            y2="20.542"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.03" stopColor="#05612D"></stop>
            <stop offset="0.3" stopColor="#017E36"></stop>
            <stop offset="0.33" stopColor="#138838"></stop>
            <stop offset="0.4" stopColor="#2E963C"></stop>
            <stop offset="0.48" stopColor="#41A13F"></stop>
            <stop offset="0.55" stopColor="#4CA740"></stop>
            <stop offset="0.63" stopColor="#50A941"></stop>
            <stop offset="0.73" stopColor="#57AB3C"></stop>
            <stop offset="0.88" stopColor="#6CAF30"></stop>
            <stop offset="0.91" stopColor="#70B02D"></stop>
          </linearGradient>
          <linearGradient
            id="foundation1_linear"
            x1="21.57"
            y1="20.542"
            x2="2.124"
            y2="20.542"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0.03" stopColor="#1F9CD4"></stop>
            <stop offset="0.3" stopColor="#1470B1"></stop>
            <stop offset="0.36" stopColor="#1A5EA2"></stop>
            <stop offset="0.44" stopColor="#214B92"></stop>
            <stop offset="0.53" stopColor="#254088"></stop>
            <stop offset="0.63" stopColor="#263C85"></stop>
            <stop offset="0.69" stopColor="#25397E"></stop>
            <stop offset="0.79" stopColor="#223169"></stop>
            <stop offset="0.9" stopColor="#1E2448"></stop>
            <stop offset="0.91" stopColor="#1E2345"></stop>
          </linearGradient>
          <linearGradient
            id="foundation2_linear"
            x1="2.498"
            y1="-2.902"
            x2="25.74"
            y2="10.457"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EDE229"></stop>
            <stop offset="0.44" stopColor="#F3A30F"></stop>
            <stop offset="0.57" stopColor="#E96316"></stop>
            <stop offset="0.68" stopColor="#E1321B"></stop>
            <stop offset="0.73" stopColor="#DE1F1D"></stop>
            <stop offset="0.84" stopColor="#DC1820"></stop>
            <stop offset="1" stopColor="#DB1222"></stop>
          </linearGradient>
          <linearGradient
            id="foundation3_linear"
            x1="21.57"
            y1="25"
            x2="21.57"
            y2="4.475"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#293170"></stop>
            <stop offset="0.06" stopColor="#313272"></stop>
            <stop offset="0.14" stopColor="#473577"></stop>
            <stop offset="0.25" stopColor="#6A3A7F"></stop>
            <stop offset="0.29" stopColor="#793C82"></stop>
            <stop offset="0.44" stopColor="#803483"></stop>
            <stop offset="0.66" stopColor="#852E83"></stop>
            <stop offset="0.97" stopColor="#59132A"></stop>
            <stop offset="1" stopColor="#551022"></stop>
          </linearGradient>
          <clipPath id="prefix__clip0">
            <path fill="#fff" d="M0 0h109.596v25H0z"></path>
          </clipPath>
        </defs>
      </svg>
    </Box>
  )
}

export default Logo
