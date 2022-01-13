import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { ReactComponent as BurgerMenuIcon } from "../assets/hamburger-menu.svg";

export type drawerProps = {
  modalToggled: boolean;
};

const Drawer: React.FC<drawerProps> = ({ children, modalToggled }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    modalToggled && toggleDrawer();
  }, [modalToggled]);

  const toggleDrawerOnSwipe = (deltaX: number) => {
    if (deltaX !== undefined) {
      Math.abs(deltaX) > 80 && toggleDrawer();
    }
  };
  const handlers = useSwipeable({
    onSwipedLeft: ({ deltaX }) => {
      toggleDrawerOnSwipe(deltaX);
    },
  });
  const openedClass = isOpen ? "isOpen" : "";

  return (
    <div className={`drawer ${openedClass}`}>
      <button className={"drawer__button"} onClick={toggleDrawer}>
        <BurgerMenuIcon />
      </button>
      <div className="drawer__overlay">
        <div
          {...handlers}
          onClick={toggleDrawer}
          className="drawer__backdrop"
        />
        <div {...handlers} className="drawer__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Drawer;
