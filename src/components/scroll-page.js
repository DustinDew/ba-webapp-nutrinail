import React, { useEffect, useState } from "react";
import InfoPage from "./info-page";
import ParticipatePage from "./participate-page";
import "../css/pageScroll.css";

// Hauptkomponente, die zwischen zwei Seiten scrollt (InfoPage & ParticipatePage)
const ScrollPage = () => {
  // State-Variablen zur Steuerung des Scrollverhaltens
  const [pageIndex, setPageIndex] = useState(0); // Aktuelle Seite (0 oder 1)
  const [scrollable, setScrollable] = useState(true); // Ist Scrollen erlaubt?
  const [touchStartY, setTouchStartY] = useState(null); // Y-Position des Touch-Starts
  const [firstLoad, setFirstLoad] = useState(true); // Flag für den allerersten Seitenaufruf
  const [firstScroll, setFirstScroll] = useState(true); // Wird nach dem ersten Scrollen auf false gesetzt
  const [start, setStart] = useState(false); // Steuert den Start der Teilnahme
  const [showScrollIndc, setShowScrollIndc] = useState(true); // Scroll-Indikator anzeigen?

  // CSS-Klasse für die erste Seite basierend auf dem pageIndex
  const getClassNamePage1 = (pageIndex) => {
    if (pageIndex === 0) return "active";
    if (pageIndex === 1) return "disabled";
    return "";
  };

  // CSS-Klasse für die zweite Seite basierend auf dem pageIndex
  const getClassNamePage2 = (pageIndex) => {
    if (pageIndex === 1) return "active";
    if (pageIndex === 0) return "disabled";
    return "";
  };

  // Effekt für Maus-Scrollen und Touch-Gesten
  useEffect(() => {
    // Handler für Maus-Scrollen (z. B. mit Mausrad)
    const handleScroll = (event) => {
      if (!scrollable) return;
      event.preventDefault(); // Verhindert das normale Scrollen

      if (firstScroll) setFirstScroll(false); // Erstes Scrollen erkannt

      if (event.deltaY > 0) {
        // Nach unten scrollen
        setPageIndex((prev) => Math.min(prev + 1, 1));
        setFirstLoad(false);
      } else if (event.deltaY < 0 && pageIndex > 0) {
        // Nach oben scrollen, aber nur wenn nicht auf erster Seite
        setPageIndex((prev) => Math.max(prev - 1, 0));
        setFirstLoad(false);
      }
    };

    // Touch-Start (Finger auf Display)
    const handleTouchStart = (event) => {
      if (!scrollable) return;
      setTouchStartY(event.touches[0].clientY);
    };

    // Touch-Move (Bewegung des Fingers)
    const handleTouchMove = (event) => {
      if (!scrollable || touchStartY === null) return;

      const touchEndY = event.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      // Nur bei spürbarer Bewegung (z. B. über 50px)
      if (Math.abs(deltaY) > 50) {
        if (firstScroll) setFirstScroll(false); // Erstes Scrollen erkannt

        if (deltaY > 0) {
          // Nach unten wischen
          setPageIndex((prev) => Math.min(prev + 1, 1));
          setFirstLoad(false);
        } else if (pageIndex > 0) {
          // Nach oben wischen
          setPageIndex((prev) => Math.max(prev - 1, 0));
          setFirstLoad(false);
        }
      }
    };
    let touchStartY = 0;




    // Event-Listener registrieren
    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    // Event-Listener wieder entfernen bei Komponentendemontage
    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [pageIndex, scrollable, touchStartY, firstScroll]);
  
  // JSX: Darstellung der beiden Seiten und des Scroll-Indikators
  return (
    <div className="pages-column">
      {/* Erste Seite */}
      <div className={`page-1 ${firstLoad ? "first-load" : getClassNamePage1(pageIndex)}`}>
        <InfoPage
          changeShowScrollIndc={() => setShowScrollIndc(!showScrollIndc)}
          firstScroll={firstScroll}
          changeScrollable={(bool) => setScrollable(bool)}
          updatePageIndex={() => setPageIndex(1)}
        />
      </div>
      
      {/* Zweite Seite */}
      <div className={`page-2 ${firstLoad ? "first-load" : getClassNamePage2(pageIndex)}`}>
        <ParticipatePage
          start={start}
          changeStart={() => setStart(!start)}
          changeScrollable={(bool) => setScrollable(bool)}
          changeShowScrollIndc={() => setShowScrollIndc(!showScrollIndc)}
        />
      </div>

      {/* Scroll-Indikator */}
      {showScrollIndc && (
        <div className="scroll-indicator">
          <div className={`dot ${pageIndex === 0 ? "active" : ""}`}></div>
          <div className={`dot ${pageIndex === 1 ? "active" : ""}`}></div>
        </div>
      )}
    </div>
  );
};

export default ScrollPage;



