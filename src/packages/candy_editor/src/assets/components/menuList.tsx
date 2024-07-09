import React, { useState } from 'react';
import { MenuListElements } from '../../types';
import { Flex, theme } from '@origyn/origyn-art-ui';

const styles = `
  .tooltip-container {
    position: absolute;
  }
  
  .tooltip {
    position: absolute;
    z-index: 999!important;
    top: 100%;
    left: 0;
    width: 200px;
    color: #fff;
    background-color: ${theme.colors.ACCENT_COLOR};
    padding: 8px;
    border-radius: 8px;
    box-shadow: ${theme.shadows.lg};
    font-size: 12px;
  }

  .listItem {
    cursor: pointer;
  }

  .listItem:hover {
    font-weight: bold;
  }
  
  .tooltip::before {
    content: "";
    position: absolute;
    top: -9px;
    left: 10%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-bottom-color: ${theme.colors.ACCENT_COLOR};
  }
  
`;

export const MenuList = (menuList: MenuListElements) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleToggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="tooltip-container">
        <div className="trigger" onClick={handleToggleTooltip}>
          {menuList.children}
        </div>
        {isTooltipVisible && (
          <div className="tooltip">
            <Flex flexFlow="column" gap={8}>
              {menuList.content.map((item, index) => {
                return (
                  <>
                    <div className="listItem" onClick={item.listItemFunction}>
                      <Flex flexFlow="row" gap={8} key={index}>
                        <Flex>
                          <p>{item.listItemText}</p>
                        </Flex>
                        <Flex>{item.listItemIcon && <div>{item.listItemIcon}</div>}</Flex>
                      </Flex>
                    </div>
                  </>
                );
              })}
            </Flex>
          </div>
        )}
      </div>
    </>
  );
};

export default MenuList;
