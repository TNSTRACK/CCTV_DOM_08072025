// examples/react-components/video-player-simple.tsx
// Reproductor de video simplificado para MVP

import React, { useRef, useEffect, useState } from 'react';
import { 
  Box, 
  IconButton, 
  Slider, 
  Paper, 
  Typography,
  LinearProgress 
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  VolumeOff,
  ZoomIn,
  ZoomOut,
  Fullscreen 
} from '@mui/icons-material';

interface VideoPlayerSimpleProps {
  src: string;
  poster?: string;
  title?: string;
  onTimeUpdate?: (time: number) => void;
}

export const VideoPlayerSimple: React.FC<VideoPlayerSimpleProps> = ({
  src,
  poster,
  title,
  onTimeUpdate,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // PATRÓN: Estados básicos del reproductor
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // PATRÓN: Control de reproducción básico
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // PATRÓN: Control de volumen
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // PATRÓN: Navegación temporal
  const handleSeek = (event: Event, newValue: number | number[]) => {
    if (videoRef.current && typeof newValue === 'number') {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
      onTimeUpdate?.(newValue);
    }
  };

  // PATRÓN: Control de zoom básico
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.5, 4)); // Máximo 4x para MVP
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.5, 1)); // Mínimo 1x
  };

  // PATRÓN: Pantalla completa
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  // PATRÓN: Event listeners del video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime);
    };
    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
    };
  }, [src, onTimeUpdate]);

  // PATRÓN: Formateo de tiempo
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Paper 
      ref={containerRef}
      elevation={3} 
      sx={{ 
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'relative'
      }}
    >
      {/* PATRÓN: Título del video */}
      {title && (
        <Box sx={{ p: 2, backgroundColor: 'rgba(0,0,0,0.8)', color: 'white' }}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}

      {/* PATRÓN: Loading indicator */}
      {isLoading && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 2 }}>
          <LinearProgress />
        </Box>
      )}

      {/* PATRÓN: Video container con zoom */}
      <Box 
        sx={{ 
          overflow: 'hidden',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
          position: 'relative'
        }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '70vh',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease',
          }}
          onError={(e) => {
            console.error('Error loading video:', e);
            setIsLoading(false);
          }}
        />
      </Box>

      {/* PATRÓN: Controles personalizados */}
      <Box sx={{ p: 2, backgroundColor: 'grey.100' }}>
        {/* Barra de progreso */}
        <Box sx={{ mb: 2 }}>
          <Slider
            value={currentTime}
            max={duration || 100}
            onChange={handleSeek}
            size="small"
            sx={{ 
              color: 'primary.main',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {formatTime(currentTime)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatTime(duration)}
            </Typography>
          </Box>
        </Box>

        {/* Controles principales */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Play/Pause */}
          <IconButton 
            onClick={togglePlayPause} 
            color="primary"
            disabled={isLoading}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>

          {/* Volumen */}
          <IconButton onClick={toggleMute} size="small">
            {isMuted || volume === 0 ? <VolumeOff /> : <VolumeUp />}
          </IconButton>
          
          <Slider
            value={isMuted ? 0 : volume}
            min={0}
            max={1}
            step={0.1}
            onChange={(_, value) => {
              if (videoRef.current && typeof value === 'number') {
                videoRef.current.volume = value;
                setVolume(value);
                if (value > 0 && isMuted) {
                  setIsMuted(false);
                  videoRef.current.muted = false;
                }
              }
            }}
            size="small"
            sx={{ width: 80, mx: 1 }}
          />

          {/* Zoom */}
          <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={handleZoomOut} 
              size="small" 
              disabled={zoomLevel <= 1}
            >
              <ZoomOut />
            </IconButton>
            
            <Typography variant="caption" sx={{ minWidth: 40, textAlign: 'center' }}>
              {zoomLevel}x
            </Typography>
            
            <IconButton 
              onClick={handleZoomIn} 
              size="small"
              disabled={zoomLevel >= 4}
            >
              <ZoomIn />
            </IconButton>

            {/* Pantalla completa */}
            <IconButton onClick={toggleFullscreen} size="small">
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
