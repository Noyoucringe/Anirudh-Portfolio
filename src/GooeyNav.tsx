import React, { useMemo, useState } from 'react';
import './GooeyNav.css';

interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: GooeyNavItem[];
  initialActiveIndex?: number;
  particleCount?: number;
  activeIndex?: number;
  onItemSelect?: (index: number, href: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  initialActiveIndex = 0,
  activeIndex,
  onItemSelect,
}) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(initialActiveIndex);
  const resolvedActiveIndex = activeIndex ?? internalActiveIndex;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number, href: string) => {
    if (activeIndex === undefined) {
      setInternalActiveIndex(index);
    }

    if (onItemSelect) {
      onItemSelect(index, href, e);
    }
  };

  const bubbleStyle = useMemo(() => ({
    transform: `translateX(calc(${resolvedActiveIndex} * 100%))`,
  }), [resolvedActiveIndex]);

  return (
    <div className="gooey-nav-container">
      <nav className="gooey-nav" role="navigation" aria-label="Primary">
        <div className="gooey-pill-track">
          <span className="gooey-active-pill" style={bubbleStyle} />
        </div>

        <ul style={{ ['--count' as string]: items.length } as React.CSSProperties}>
          {items.map((item, index) => (
            <li key={item.label} className={resolvedActiveIndex === index ? 'active' : ''}>
              <a href={item.href} onClick={(e) => handleClick(e, index, item.href)}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default GooeyNav;