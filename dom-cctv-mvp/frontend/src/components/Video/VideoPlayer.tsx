// src/components/Video/VideoPlayer.tsx
// Reproductor de video avanzado con Video.js

import React, { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import {
  Box,
  IconButton,
  Tooltip,
  Slider,
  Typography,
  ButtonGroup,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  VolumeUp as VolumeIcon,
  Fullscreen as FullscreenIcon,
  Speed as SpeedIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RestartAlt as RestartIcon,
} from '@mui/icons-material';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  onReady?: (player: any) => void;
  onError?: (error: any) => void;
  autoplay?: boolean;
  controls?: boolean;
  width?: number | string;
  height?: number | string;
}

/**
 * Reproductor de video avanzado con controles personalizados
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  title,
  onReady,
  onError,
  autoplay = false,
  controls = true,
  width = '100%',
  height = 'auto',
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // Asegurar que el componente esté montado
    if (!videoRef.current) return;

    // Configuración del reproductor
    const videoElement = document.createElement('video-js');
    videoElement.classList.add('vjs-big-play-centered');
    videoRef.current.appendChild(videoElement);

    const player = videojs(videoElement, {
      autoplay: autoplay,
      controls: controls,
      responsive: true,
      fluid: true,
      poster: poster,
      sources: [{
        src: src,
        type: 'video/mp4'
      }],
      playbackRates: [0.25, 0.5, 1, 1.25, 1.5, 2],
      techOrder: ['html5'],
      html5: {
        vhs: {
          overrideNative: !videojs.browser.IS_SAFARI
        }
      }
    });

    player.ready(() => {
      setIsReady(true);
      setIsLoading(false);
      onReady?.(player);
    });

    // Event listeners
    player.on('play', () => setIsPlaying(true));
    player.on('pause', () => setIsPlaying(false));
    player.on('ended', () => setIsPlaying(false));
    
    player.on('timeupdate', () => {
      setCurrentTime(player.currentTime());
      setDuration(player.duration());
    });

    player.on('volumechange', () => {
      setVolume(player.volume());
    });

    player.on('ratechange', () => {
      setPlaybackRate(player.playbackRate());
    });

    player.on('error', (e: any) => {
      const errorMsg = 'Error al cargar el video';
      setError(errorMsg);
      setIsLoading(false);
      onError?.(e);
    });

    playerRef.current = player;

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, autoplay, controls, onReady, onError]);

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = () => {
    if (!playerRef.current) return;
    
    if (isPlaying) {
      playerRef.current.pause();
    } else {
      playerRef.current.play();
    }
  };

  const handleSeek = (value: number) => {
    if (!playerRef.current) return;
    playerRef.current.currentTime(value);
  };

  const handleVolumeChange = (value: number) => {
    if (!playerRef.current) return;
    playerRef.current.volume(value);
  };

  const handleSpeedChange = (rate: number) => {
    if (!playerRef.current) return;
    playerRef.current.playbackRate(rate);
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(newZoom);
    if (videoRef.current) {
      const videoElement = videoRef.current.querySelector('video');
      if (videoElement) {
        videoElement.style.transform = `scale(${newZoom})`;
        videoElement.style.transformOrigin = 'center center';
      }
    }
  };

  const handleRestart = () => {
    if (!playerRef.current) return;
    playerRef.current.currentTime(0);
    playerRef.current.play();
  };

  const handleFullscreen = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isFullscreen()) {
      playerRef.current.exitFullscreen();
    } else {
      playerRef.current.requestFullscreen();
    }
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ width, height, position: 'relative' }}>
      {/* Title */}
      {title && (
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
      )}

      {/* Loading State */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {/* Video Container */}
      <Box
        ref={videoRef}
        sx={{
          width: '100%',
          minHeight: 300,
          backgroundColor: '#000',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
        }}
      />

      {/* Custom Controls */}
      {isReady && (
        <Box sx={{ mt: 2 }}>
          {/* Playback Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Tooltip title={isPlaying ? 'Pausar' : 'Reproducir'}>
              <IconButton onClick={handlePlayPause} color="primary">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Reiniciar">
              <IconButton onClick={handleRestart}>
                <RestartIcon />
              </IconButton>
            </Tooltip>

            <Box sx={{ flex: 1, mx: 2 }}>
              <Slider
                value={currentTime}
                max={duration || 100}
                onChange={(_, value) => handleSeek(value as number)}
                valueLabelDisplay="auto"
                valueLabelFormat={formatTime}
                size="small"
              />
            </Box>

            <Typography variant="caption" sx={{ minWidth: 80, textAlign: 'center' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            <Tooltip title="Pantalla completa">
              <IconButton onClick={handleFullscreen}>
                <FullscreenIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Advanced Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {/* Volume */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
              <VolumeIcon fontSize="small" />
              <Slider
                value={volume}
                max={1}
                step={0.1}
                onChange={(_, value) => handleVolumeChange(value as number)}
                size="small"
                sx={{ width: 80 }}
              />
            </Box>

            {/* Speed */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpeedIcon fontSize="small" />
              <ButtonGroup size="small" variant="outlined">
                {[0.5, 1, 1.5, 2].map((rate) => (
                  <Button
                    key={rate}
                    onClick={() => handleSpeedChange(rate)}
                    variant={playbackRate === rate ? 'contained' : 'outlined'}
                    sx={{ minWidth: 45 }}
                  >
                    {rate}x
                  </Button>
                ))}
              </ButtonGroup>
            </Box>

            {/* Zoom */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Zoom out">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => handleZoomChange(Math.max(0.5, zoom - 0.25))}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOutIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Chip
                label={`${Math.round(zoom * 100)}%`}
                size="small"
                variant="outlined"
                sx={{ minWidth: 60 }}
              />
              
              <Tooltip title="Zoom in">
                <span>
                  <IconButton
                    size="small"
                    onClick={() => handleZoomChange(Math.min(3, zoom + 0.25))}
                    disabled={zoom >= 3}
                  >
                    <ZoomInIcon fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default VideoPlayer;