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
    artist: "格朗 · 个人 AI 制作",
    durationLabel: "02:01",
    src: "/media/music/xiaobuwuqu.mp4",
    link: "https://qishui.douyin.com/s/iXdhbkjN/"
  },
  { id: "7666287042533181481", title: "工棚顶", artist: "格朗 · 个人 AI 制作", durationLabel: "03:55", src: "/media/music/7666287042533181481.mp4", link: "https://www.douyin.com/qishui/song/7666287042533181481" },
  { id: "7666287042533132329", title: "破瓦上", artist: "格朗 · 个人 AI 制作", durationLabel: "03:57", src: "/media/music/7666287042533132329.mp4", link: "https://www.douyin.com/qishui/song/7666287042533132329" },
  { id: "7666287042533083177", title: "别低头", artist: "格朗 · 个人 AI 制作", durationLabel: "03:53", src: "/media/music/7666287042533083177.mp4", link: "https://www.douyin.com/qishui/song/7666287042533083177" },
  { id: "7666287042533034025", title: "苦在人间", artist: "格朗 · 个人 AI 制作", durationLabel: "04:39", src: "/media/music/7666287042533034025.mp4", link: "https://www.douyin.com/qishui/song/7666287042533034025" },
  { id: "7666287042532984873", title: "人间苦", artist: "格朗 · 个人 AI 制作", durationLabel: "03:34", src: "/media/music/7666287042532984873.mp4", link: "https://www.douyin.com/qishui/song/7666287042532984873" },
  { id: "7666287042532935721", title: "苦日子", artist: "格朗 · 个人 AI 制作", durationLabel: "04:28", src: "/media/music/7666287042532935721.mp4", link: "https://www.douyin.com/qishui/song/7666287042532935721" },
  { id: "7666287042532886569", title: "井边长歌", artist: "格朗 · 个人 AI 制作", durationLabel: "04:45", src: "/media/music/7666287042532886569.mp4", link: "https://www.douyin.com/qishui/song/7666287042532886569" },
  { id: "7666287042532821033", title: "生活好难", artist: "格朗 · 个人 AI 制作", durationLabel: "05:28", src: "/media/music/7666287042532821033.mp4", link: "https://www.douyin.com/qishui/song/7666287042532821033" },
  { id: "7666285735685769235", title: "红绢渡河", artist: "格朗 · 个人 AI 制作", durationLabel: "04:35", src: "/media/music/7666285735685769235.mp4", link: "https://www.douyin.com/qishui/song/7666285735685769235" },
  { id: "7666285735685720083", title: "桃花渡月", artist: "格朗 · 个人 AI 制作", durationLabel: "05:17", src: "/media/music/7666285735685720083.mp4", link: "https://www.douyin.com/qishui/song/7666285735685720083" }
];

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "00:00";
  const minutes = Math.floor(value / 60).toString().padStart(2, "0");
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function durationToSeconds(label: string) {
  const [minutes, seconds] = label.split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}

export default function MusicDock() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(durationToSeconds(tracks[0].durationLabel));
  const [volume, setVolume] = useState(0.72);
  const [message, setMessage] = useState("默认静音 · 展开列表，选择一首原创音轨");

  const track = tracks[trackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    audio.load();
    setPlaying(false);
    setPosition(0);
    setDuration(durationToSeconds(track.durationLabel));
    setMessage(`已选择「${track.title}」· 点击播放试听`);
  }, [trackIndex, track.durationLabel, track.title]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const selectTrack = (index: number) => {
    setTrackIndex(index);
    setExpanded(true);
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
      setMessage(`正在播放「${track.title}」· 格朗 · 个人 AI 制作`);
    } catch {
      setPlaying(false);
      setMessage("本地试听资源暂时不可用 · 请打开汽水音乐原页");
    }
  };

  const seek = (value: string) => {
    const next = Number(value);
    const audio = audioRef.current;
    if (audio) audio.currentTime = next;
    setPosition(next);
  };

  return <aside className={`musicDock ${expanded ? "is-expanded" : ""} ${playing ? "is-playing" : ""}`} aria-label="格朗原创音乐播放器">
    <audio
      ref={audioRef}
      src={track.src}
      preload="none"
      aria-label={`${track.title}，格朗个人 AI 制作`}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onTimeUpdate={event => setPosition(event.currentTarget.currentTime)}
      onLoadedMetadata={event => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : durationToSeconds(track.durationLabel))}
      onEnded={() => {
        setPlaying(false);
        setPosition(0);
        setMessage(`「${track.title}」播放完毕 · 可选择下一首`);
      }}
      onError={() => {
        setPlaying(false);
        setMessage("本地试听资源暂时不可用 · 请打开汽水音乐原页");
      }}
    />
    <div className="musicDockTop">
      <div className="musicDockIdentity">
        <span className={`musicPulse ${playing ? "is-playing" : ""}`} aria-hidden="true" />
        <div><span>ORIGINAL SCORE</span><strong>格朗 · 个人 AI 音乐</strong></div>
      </div>
      <button type="button" className="musicDockExpand" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls="music-dock-panel" aria-label={expanded ? "收起音乐列表" : "展开音乐列表"}>{expanded ? "−" : "+"}</button>
    </div>
    <div className="musicDockTrack">
      <button type="button" className="musicDockCurrent" onClick={() => setExpanded(true)} aria-label={`展开曲目列表，当前为${track.title}`}>
        <span className="musicDockCurrentIndex">{String(trackIndex + 1).padStart(2, "0")}</span>
        <span><strong>{track.title}</strong><small>{track.artist}</small></span>
      </button>
      <span className="musicDockTime">{formatTime(position)} / {track.durationLabel}</span>
    </div>
    <div className="musicDockPanel" id="music-dock-panel" hidden={!expanded}>
      <div className="musicDockPanelHead"><div><span className="musicDockLabel">MY AI MUSIC / {tracks.length} TRACKS</span><strong>原创音轨列表</strong></div><a href={track.link} target="_blank" rel="noreferrer">汽水音乐主页 ↗</a></div>
      <div className="musicDockCredit"><span>署名</span><strong>格朗 · 个人 AI 制作</strong><small>每首歌都保留汽水音乐原页，可打开查看完整信息。</small></div>
      <div className="musicDockList" role="listbox" aria-label="格朗个人 AI 音乐列表">
        {tracks.map((item, index) => <div className={`musicDockItem ${index === trackIndex ? "is-current" : ""}`} key={item.id} role="option" aria-selected={index === trackIndex}>
          <button type="button" onClick={() => selectTrack(index)}>
            <span className="musicDockItemNo">{String(index + 1).padStart(2, "0")}</span>
            <span className="musicDockItemCopy"><strong>{item.title}</strong><small>{item.artist}</small></span>
            <span className="musicDockItemDuration">{item.durationLabel}</span>
          </button>
          <a href={item.link} target="_blank" rel="noreferrer" aria-label={`打开${item.title}的汽水音乐页面`}>↗</a>
        </div>)}
      </div>
      <div className="musicDockWave" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
      <p className="musicDockMessage" aria-live="polite">{message}</p>
      <input className="musicDockRange" type="range" min="0" max={Math.max(duration, 1)} step="0.1" value={Math.min(position, duration)} onChange={event => seek(event.target.value)} aria-label="播放进度" />
      <div className="musicDockControls">
        <button type="button" className="musicDockPlay" onClick={togglePlayback} aria-label={playing ? `暂停${track.title}` : `播放${track.title}`}>{playing ? "Ⅱ" : "▶"}<span>{playing ? "暂停" : "播放"}</span></button>
        <label className="musicDockVolume"><span>VOL</span><input type="range" min="0" max="1" step="0.01" value={volume} onChange={event => setVolume(Number(event.target.value))} aria-label="音量" /></label>
        <a href={track.link} target="_blank" rel="noreferrer">打开当前曲目 ↗</a>
      </div>
    </div>
  </aside>;
}
