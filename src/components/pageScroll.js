import React, { useEffect, useState } from "react";
import MainContent from "./pageOne";
import "../css/pageScroll.css";
import PageTwo from "./pageTwo";

const PageScroll = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [scrollable, setScrollable] = useState(true);
  const [touchStartY, setTouchStartY] = useState(null);
  const [firstLoad, setFirstLoad] = useState(true);

  // Setze firstLoad auf false nach dem ersten Render
  useEffect(() => {
    
  }, []);

  const getClassNamePage1 = (pageIndex) => {
    if (pageIndex === 0) {
      return "active";
    } else if (pageIndex === 1) {
      return "disabled";
    }
    return "";
  };

  const getClassNamePage2 = (pageIndex) => {
    if (pageIndex === 1) {
      return "active";
    } else if (pageIndex === 0){
      return "disabled";
    }
    return "";
  };

  useEffect(() => {
    const handleScroll = (event) => {
      if (!scrollable) return;
      event.preventDefault();

      if (event.deltaY > 0) { 
        setPageIndex((prev) => Math.min(prev + 1, 1));
        setFirstLoad(false);
      } else if (event.deltaY < 0 && pageIndex > 0) { // Nur nach oben scrollen, wenn pageIndex > 0
        setPageIndex((prev) => Math.max(prev - 1, 0));
        setFirstLoad(false);
      }
      
    };

    const handleTouchStart = (event) => {
      if (!scrollable) return;
      setTouchStartY(event.touches[0].clientY);
    };

    const handleTouchMove = (event) => {
      if (!scrollable || touchStartY === null) return;
      const touchEndY = event.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (Math.abs(deltaY) > 50) { 
        if (deltaY > 0) { // Nach unten
          setPageIndex((prev) => Math.min(prev + 1, 1));
          setFirstLoad(false);
        } else if (pageIndex > 0) { // Nur nach oben scrollen, wenn pageIndex > 0
          setPageIndex((prev) => Math.max(prev - 1, 0));
          setFirstLoad(false);
        }
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [pageIndex, scrollable, touchStartY]);

  return (
    <div className="pages-column">
      <div className={`page-1 ${firstLoad ? "first-load": getClassNamePage1(pageIndex)}`}>
        <MainContent changeScrollable={(boolean) => setScrollable(boolean)} />
      </div>
      <div className={`page-2 ${firstLoad ? "first-load" : getClassNamePage2(pageIndex)}`}>
        <PageTwo changeScrollable={(boolean) => setScrollable(boolean)} />
      </div>
    </div>
  );
};

export default PageScroll;
