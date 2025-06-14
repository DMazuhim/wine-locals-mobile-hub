
import React, { useEffect, useRef } from "react";

type VideoGalleryItem = {
  playback_id?: string;
  youtubeId?: string;
  videoUrl?: string;
};

function detectVideoSource(item: VideoGalleryItem): {
  type: "mux" | "youtube" | null;
  playbackId?: string;
  youtubeId?: string;
  url?: string;
} {
  if (!item) return { type: null };
  if (item.youtubeId) {
    return { type: "youtube", youtubeId: item.youtubeId };
  }
  if (item.videoUrl && item.videoUrl.includes("youtube")) {
    const ytMatch = item.videoUrl.match(/[?&]v=([^&]+)/);
    return {
      type: "youtube",
      youtubeId: ytMatch ? ytMatch[1] : undefined,
    };
  }
  if (item.playback_id) {
    return { type: "mux", playbackId: item.playback_id };
  }
  return { type: null };
}

type Props = {
  item: VideoGalleryItem;
  autoPlay?: boolean;
  muted?: boolean;
  play?: boolean; // se deve tocar de fato (cartão ativo e não pausado)
  paused?: boolean;
  height?: string;
  width?: string;
  className?: string;
};

const MuxOrYoutubePlayer: React.FC<Props> = ({
  item,
  autoPlay = true,
  muted = false,
  play = true,   // está ativo e não está pausado
  paused = false,
  height = "100%",
  width = "100%",
  className = "",
}) => {
  const detection = detectVideoSource(item);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    // Sincroniza play/pause
    if (play && !paused) {
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {});
      }
    } else {
      videoRef.current.pause();
    }
  }, [play, paused]);

  if (detection.type === "mux" && detection.playbackId) {
    const muxMp4Url = `https://stream.mux.com/${detection.playbackId}/medium.mp4`;
    return (
      <video
        ref={videoRef}
        className={className}
        style={{ width, height, objectFit: "cover", background: "black" }}
        src={muxMp4Url}
        autoPlay={autoPlay && play && !paused}
        controls={false}
        muted={muted}
        loop
        playsInline
      />
    );
  }

  if (detection.type === "youtube" && detection.youtubeId) {
    // Para iframes do YouTube, não há API de controles: troca a url (autoplay=1/0)
    // Importante: autoplay+áudio só funciona após interação manual do usuário!
    const url = `https://www.youtube.com/embed/${detection.youtubeId}?autoplay=${(autoPlay && play && !paused) ? 1 : 0}&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${detection.youtubeId}&modestbranding=1&showinfo=0&playsinline=1`;
    return (
      <iframe
        className={className}
        style={{ width, height, objectFit: "cover", background: "black" }}
        src={url}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube player"
        tabIndex={-1}
      ></iframe>
    );
  }
  // Fallback placeholder
  return (
    <div
      className={`flex items-center justify-center bg-black text-white text-xs ${className}`}
      style={{ width, height }}
    >
      Vídeo indisponível
    </div>
  );
};

export default MuxOrYoutubePlayer;
