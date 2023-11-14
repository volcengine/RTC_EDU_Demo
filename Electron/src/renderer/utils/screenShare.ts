export function isVeRtcApplication(appInfo: { source_name: string }) {
  const { source_name } = appInfo;

  return source_name === 'veRTC' || source_name === 'veRTC Room';
}
