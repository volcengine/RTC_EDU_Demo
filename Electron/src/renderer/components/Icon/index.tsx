import React, { useEffect, useRef } from 'react';

// 解析SVG
const getDom = async (url: string) => {
  const res = await fetch(url);
  if (res) {
    const text = await res.text();
    // https://developer.mozilla.org/zh-CN/docs/Web/API/DOMParser
    return new window.DOMParser().parseFromString(text, 'text/xml');
  }
  return undefined;
};

const MenuIcon: React.FC<{ src: string; className?: string }> = ({ src, className = '' }) => {
  const wrapper = useRef<HTMLDivElement>(null);

  const renderSVG = async () => {
    const svg = await getDom(src);

    if (svg?.documentElement instanceof SVGSVGElement) {
      wrapper.current?.replaceChildren(svg.documentElement);
    }
  };

  useEffect(() => {
    src && renderSVG();
  }, [src]);

  return <span ref={wrapper} className={` ${className}`} />;
};

export default MenuIcon;
