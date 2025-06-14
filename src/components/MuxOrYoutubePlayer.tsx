
import React from "react";

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
  height?: string;
  width?: string;
  className?: string;
};

const MuxOrYoutubePlayer: React.FC<Props> = ({
  item,
  autoPlay = true,
  muted = false,
  height = "100%",
  width = "100%",
  className = "",
}) => {
  const detection = detectVideoSource(item);

  if (detection.type === "mux" && detection.playbackId) {
    const muxUrl = `https://stream.mux.com/${detection.playbackId}.m3u8`;
    // Use video/mp4 fallback for autoplay (mux auto-creates mp4 proxy)
    const muxMp4Url = `https://stream.mux.com/${detection.playbackId}/medium.mp4`;
    return (
      <video
        className={className}
        style={{ width, height, objectFit: "cover", background: "black" }}
        src={muxMp4Url}
        autoPlay={autoPlay}
        controls={false}
        muted={muted}
        loop
        playsInline
      />
    );
  }
  if (detection.type === "youtube" && detection.youtubeId) {
    // https://developers.google.com/youtube/player_parameters
    // autoplay=1, mute=0 for sound, modestbranding, loop, controls=0
    const url = `https://www.youtube.com/embed/${detection.youtubeId}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${detection.youtubeId}&modestbranding=1&showinfo=0&playsinline=1`;
    return (
      <iframe
        className={className}
        style={{ width, height, objectFit: "cover", background: "black" }}
        src={url}
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="YouTube player"
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
