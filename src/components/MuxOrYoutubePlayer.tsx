
import React, { useEffect, useRef } from "react";

type VideoGalleryItem = {
  playback_id?: string;
  youtubeId?: string;
  videoUrl?: string;
};

// Detects if it's a youtube id/link or a mux playback id
function detectVideoSource(item: VideoGalleryItem): {
  type: "mux" | "youtube" | null;
  playbackId?: string;
  youtubeId?: string;
  url?: string;
} {
  if (!item) return { type: null };
  // 1. YouTube
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
  // 2. Mux
  if (item.playback_id) {
    return { type: "mux", playbackId: item.playback_id };
  }
  // 3. Fallback unsupported
  return { type: null };
}

type Props = {
  item: VideoGalleryItem;
  autoPlay?: boolean;
  muted?: boolean;
  play?: boolean; // true se deve realmente tocar
  height?: string;
  width?: string;
  className?: string;
};

const MuxOrYoutubePlayer: React.FC<Props> = ({
  item,
  autoPlay = true,
  muted = false,
  play = true, // novo controle!
  height = "100%",
  width = "100%",
  className = "",
}) => {
  const detection = detectVideoSource(item);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (play) {
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {});
      }
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [play]);

  if (detection.type === "mux" && detection.playbackId) {
    const muxMp4Url = `https://stream.mux.com/${detection.playbackId}/medium.mp4`;
    return (
      <video
        ref={videoRef}
        className={className}
        style={{ width, height, objectFit: "cover", background: "black" }}
        src={muxMp4Url}
        autoPlay={autoPlay && play}
        controls={false}
        muted={muted ? true : false}
        loop
        playsInline
      />
    );
  }

  if (detection.type === "youtube" && detection.youtubeId) {
    /**
     * No mobile, browsers bloqueiam autoplay com áudio em iframes externos (YouTube).
     * Podemos tentar autoplay, mas o áudio SÓ toca se o usuário interage com a página/navegador.
     * Vamos trocar playlist apenas se play estiver ativo.
    */
    const url = `https://www.youtube.com/embed/${detection.youtubeId}?autoplay=${(autoPlay && play) ? 1 : 0}&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${detection.youtubeId}&modestbranding=1&showinfo=0&playsinline=1`;
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
