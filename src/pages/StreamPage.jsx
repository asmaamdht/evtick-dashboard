import React, { useState, useRef, useEffect } from "react";
import {
  LivestreamPlayer,
  StreamVideo,
  StreamVideoClient,
} from "@stream-io/video-react-sdk";

const apiKey = "n4bxhj5ucfb7";
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJAc3RyZWFtLWlvL2Rhc2hib2FyZCIsImlhdCI6MTc2NTM4MzgwNCwiZXhwIjoxNzY1NDcwMjA0LCJ1c2VyX2lkIjoiIWFub24iLCJyb2xlIjoidmlld2VyIiwiY2FsbF9jaWRzIjpbImxpdmVzdHJlYW06bGl2ZXN0cmVhbV80ZWExM2YxYy1jNWNlLTRjODItYTg2NC04YTAwNjc3ZTViYTciXX0.D8f5ingtkF0aM24_iF7Tawsr5ci_aYygjGDzl_qR10w";

const user = { type: "anonymous" };

// 👉 make it static like you requested
const callId = "livestream_4ea13f1c-c5ce-4c82-a864-8a00677e5ba7";

const client = new StreamVideoClient({ apiKey, user, token });

export default function StreamPage() {
  const playerRef = useRef(null);
  const containerRef = useRef(null);

  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [volume, setVolume] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (playerRef.current) {
      if (playing) playerRef.current.pause();
      else playerRef.current.play();
      setPlaying(!playing);
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      playerRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    if (playerRef.current) playerRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f0f0f",
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={() => setControlsVisible(true)}
        style={{
          position: "relative",
          width: "95%",
          maxWidth: "1100px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 15px 50px rgba(0,0,0,0.8)",
        }}
      >
        {/* LIVE + Timer */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#e74c3c",
              color: "#fff",
              fontWeight: "bold",
              padding: "6px 12px",
              borderRadius: "12px",
            }}
          >
            LIVE
          </div>
          <div
            style={{
              color: "#fff",
              padding: "4px 8px",
              borderRadius: "8px",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            {formatTime(elapsed)}
          </div>
        </div>

        {/* Video player */}
        <StreamVideo client={client}>
          <LivestreamPlayer
            ref={playerRef}
            callType="livestream"
            callId={callId}
            style={{
              width: "100%",
              height: "600px",
              backgroundColor: "#000",
            }}
          />
        </StreamVideo>

        {/* Controls */}
        <div
          style={{
            position: "absolute",
            bottom: "0",
            left: "0",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 20px",
            background: controlsVisible
              ? "linear-gradient(to top, rgba(0,0,0,0.85), transparent)"
              : "transparent",
            opacity: controlsVisible ? 1 : 0,
            transition: "opacity 0.3s",
          }}
        >
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={togglePlay} style={btn}>
              {playing ? "Pause" : "Play"}
            </button>

            <button onClick={toggleMute} style={btn}>
              {muted ? "Unmute" : "Mute"}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ width: "100px" }}
            />
          </div>

          <button onClick={toggleFullscreen} style={btn}>
            {fullscreen ? "Exit" : "Fullscreen"}
          </button>
        </div>
      </div>
    </div>
  );
}

const btn = {
  padding: "8px 16px",
  borderRadius: "8px",
  border: "none",
  background: "#3498db",
  color: "#fff",
  cursor: "pointer",
};
