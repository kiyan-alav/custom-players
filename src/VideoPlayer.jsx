import {useEffect, useRef, useState} from 'react';
import Backward15SecIcon from "./components/Backward15SecIcon.jsx";
import PlayIcon from "./components/PlayIcon.jsx";
import PuaseIcon from "./components/PuaseIcon.jsx";
import Forward15SecIcon from "./components/Forward15SecIcon.jsx";
import MuteIcon from "./components/MuteIcon.jsx";
import UnMuteIcon from "./components/UnMuteIcon.jsx";
import MaximizeIcon from "./components/MaximizeIcon.jsx";
// import PlaySpeedIcon from "./components/PlaySpeedIcon.jsx";
import SpeedIcon from "./components/SpeedIcon.jsx";
import RedSpeedIcon from "./components/RedSpeedIcon.jsx";
import VideoTest from "./assets/Joren_Falls_Izu_Jap.mp4"

function VideoPlayer() {
    const videoRef = useRef(null);

    const [playPause, setPlayPause] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [openPlaySpeedDropdown, setOpenPlaySpeedDropdown] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    // const [showVolumeControls, setShowVolumeControls] = useState(false);
    const [volume, setVolume] = useState(1); // Initial volume level

    const playSpeedOptions = [0.5, 1, 1.5, 1.75, 2];

    const playSpeedClass = (speed) => {
        return speed === playSpeed ? "active" : "";
    };

    const playPauseToggle = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setPlayPause(false);
        } else {
            video.pause();
            setPlayPause(true);
        }
    };

    const skipBackwardHandler = () => {
        const video = videoRef.current;
        video.currentTime -= 15;
    };

    const skipForwardHandler = () => {
        const video = videoRef.current;
        video.currentTime += 15;
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen()
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    };

    const handleProgressBarClick = (e) => {
        const video = videoRef.current;
        const progressBar = e.target;
        const offsetX = e.clientX - progressBar.getBoundingClientRect().left;
        const percentage = offsetX / progressBar.offsetWidth;
        video.currentTime = percentage * duration;
    };

    const handlePlaySpeedChange = (speed) => {
        const video = videoRef.current;
        setPlaySpeed(speed);
        video.playbackRate = speed;
    };

    const toggleMute = () => {
        const video = videoRef.current;
        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleVolumeChange = (e) => {
        const newVolume = e.target.value;
        const video = videoRef.current;
        video.volume = newVolume;
        setVolume(newVolume);
        if (+newVolume === 0) {
            console.log("Yes")
            setIsMuted(true);
        } else {
            console.log("no ")
            setIsMuted(false);
        }
    };

    useEffect(() => {
        const video = videoRef.current;
        setPlayPause(video?.paused);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const updateTime = () => {
            setCurrentTime(video.currentTime);
            setDuration(video.duration);
        };

        video.addEventListener('timeupdate', updateTime);
        return () => {
            video.removeEventListener('timeupdate', updateTime);
        };
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <div className="video-player-container">
            <video ref={videoRef}
                   src={VideoTest}
                   type="video/mp4"
                   className="video-player-tag">
            </video>
            <div className="video-player-controls">
                <div className="top-section"></div>
                <div className="middle-section">
                    <button className="backward-btn" onClick={skipBackwardHandler}>
                        <Backward15SecIcon/>
                    </button>
                    <button onClick={playPauseToggle}>
                        {playPause ? <PlayIcon/> : <PuaseIcon/>}
                    </button>
                    <button className="forward-btn" onClick={skipForwardHandler}>
                        <Forward15SecIcon/>
                    </button>
                </div>
                <div className="bottom-section">
                    <div className="video-time">
                        <span>{formatTime(currentTime)}</span>
                        <span>/</span>
                        <span>{formatTime(duration)}</span>
                    </div>
                    <div className="video-progress-container">
                        <progress
                            max={duration}
                            value={currentTime}
                            className="video-progress"
                            onClick={handleProgressBarClick}
                        ></progress>
                    </div>
                    <div className="action-btns">
                        <div className="left-actions">
                            <button onClick={toggleMute}>
                                {
                                    isMuted || volume === 0 ? <MuteIcon/> : <UnMuteIcon/>
                                }
                            </button>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="slider-video"
                            />
                        </div>
                        <div className="right-actions">
                            <button onClick={toggleFullscreen}>
                                <MaximizeIcon/>
                            </button>
                            <div className="play-speed-dropdown">
                                <button style={{
                                    position: "relative",
                                    zIndex: "999999"
                                }} onClick={() => setOpenPlaySpeedDropdown(prev => !prev)}>
                                    {
                                        !openPlaySpeedDropdown ? <SpeedIcon/> : <RedSpeedIcon/>
                                    }
                                </button>
                                <ul className={`dropdown-items ${openPlaySpeedDropdown ? "show-dropdown-items" : ""}`}>
                                    {playSpeedOptions.map(speed => (
                                        <li key={speed} className={`dropdown-item ${playSpeedClass(speed)}`}
                                            onClick={() => handlePlaySpeedChange(speed)}>
                                            {speed}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoPlayer;