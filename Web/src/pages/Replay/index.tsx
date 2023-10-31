import { useSearchParams } from 'react-router-dom';

function Replay() {
  const [searchParams] = useSearchParams();

  const videoUrl = searchParams.get('videoUrl') || '';

  return (
    <video
      controls
      style={{
        width: '100%',
        height: '100%',
        background: '#000',
      }}
    >
      <source src={decodeURIComponent(videoUrl)} type="video/mp4" />
    </video>
  );
}

export default Replay;
