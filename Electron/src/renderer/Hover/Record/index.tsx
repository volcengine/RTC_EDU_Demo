import React from 'react';

const Record: React.FC<{ url: string }> = ({ url }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: '#000',
      }}
    >
      {url && (
        <video
          controls
          style={{
            width: '100%',
            height: '100%',
            background: '#000',
          }}
        >
          <source src={url} />
        </video>
      )}
    </div>
  );
};

export default Record;
