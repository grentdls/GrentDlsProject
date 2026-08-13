"use client";

import { useEffect, useRef, useState } from "react";

type MusicTrack = {
  id: string;
  title: string;
  artist: string;
  durationLabel: string;
  src: string;
  link: string;
};

const tracks: MusicTrack[] = [
  {
    id: "xiaobuwuqu",
    title: "小步舞曲",
    artist: "格朗 · 原创",
    durationLabel: "02:01",
    src: "/media/music/xiaobuwuqu.mp4",
    link: "https://qishui.douyin.com/s/iXdhbkjN/"
  }
];

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export default function MusicDock() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(121);
  const [volume, setVolume] = useState(0.72);
  const [message, setMessage] = useState("点击播放，听一段我做的声音。");

  const track = tracks[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    setPlaying(false);
    setPosition(0);
    setMessage("点击播放，听一段我做的声音。");
  }, [trackIndex]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateTime = () => setPosition(audio.currentTime);
    const updateDuration = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 121);
    const finish = () => {
      setPlaying(false);
      setPosition(0);
      setMessage("这首曲子播放完了，可以从头再听一遍。");
    };
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", finish);
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", finish);
    };
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
      setMessage("已暂停，位置会被保留。");
      return;
    }
    try {
      await audio.play();
      setPlaying(true);
      setMessage("正在播放原创音轨。");
    } catch {
      setMessage("浏览器没有加载音频，请点击汽水音乐页面试听。");
    }
  };

  const seek = (value: string) => {
    const next = Number(value);
    const audio = audioRef.current;
    if (audio) audio.currentTime = next;
    setPosition(next);
  };

  return <aside className={`musicDock ${expanded ? "is-expanded" : ""}`} aria-label="原创音乐播放器">
    <audio ref={audioRef} src={track.src} preload="metadata" />
    <div className="musicDockTop">
      <div className="musicDockIdentity"><span className={`musicPulse ${playing ? "is-playing" : ""}`} aria-hidden="true" /><div><span>ORIGINAL SCORE</span><strong>现场音轨</strong></div></div>
      <button type="button" className="musicDockExpand" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls="music-dock-panel">{expanded ? "−" : "+"}</button>
    </div>
    <div className="musicDockTrack"><div><strong>{track.title}</strong><span>{track.artist}</span></div><span className="musicDockTime">{formatTime(position)} / {track.durationLabel}</span></div>
    <div className="musicDockPanel" id="music-dock-panel" hidden={!expanded}>
      <div className="musicDockWave" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
      <p className="musicDockMessage" aria-live="polite">{message}</p>
      <input className="musicDockRange" type="range" min="0" max={Math.max(duration, 1)} step="0.1" value={Math.min(position, duration)} onChange={event => seek(event.target.value)} aria-label="播放进度" />
      <div className="musicDockControls"><button type="button" className="musicDockPlay" onClick={togglePlayback} aria-label={playing ? "暂停原创音乐" : "播放原创音乐"}>{playing ? "Ⅱ" : "▶"}<span>{playing ? "暂停" : "播放"}</span></button><label className="musicDockVolume"><span>VOL</span><input type="range" min="0" max="1" step="0.01" value={volume} onChange={event => setVolume(Number(event.target.value))} aria-label="音量" /></label><a href={track.link} target="_blank" rel="noreferrer">汽水音乐 ↗</a></div>
    </div>
  </aside>;
}
