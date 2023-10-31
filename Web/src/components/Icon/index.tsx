import { useEffect, useRef } from 'react';

const getDom = async (url: string) => {
  const res = await fetch(url);
  if (res) {
    const text = await res.text();
    // https://developer.mozilla.org/zh-CN/docs/Web/API/DOMParser
    return new window.DOMParser().parseFromString(text, 'text/xml');
  }
  return undefined;
};

function MenuIcon({ src, className = '' }: { src: string; className?: string }) {
  const wrapper = useRef<HTMLDivElement>(null);

  const renderSVG = async () => {
    const svg = await getDom(src);

    if (svg?.documentElement instanceof SVGSVGElement) {
      if (wrapper.current) {
        wrapper.current!.innerHTML = '';
        wrapper.current?.appendChild(svg?.documentElement);
      }
    }
  };

  useEffect(() => {
    src && renderSVG();
  }, [src]);

  return <span ref={wrapper} className={`${className}`} />;
}

export default MenuIcon;
