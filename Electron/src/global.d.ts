declare module '*.jpg' {
  const jpg: string;
  export default jpg;
}
declare module '*.png' {
  const png: string;
  export default png;
}
declare module '*.svg' {
  const svg: string;
  export default svg;
}
declare module '*.less' {
  const classes: {
    readonly [key: string]: string;
  };
  export default classes;
}

declare interface Window {
  VERTCVideo: any;
  veTools: any;
}
