import {useRef, useState, useEffect} from "react";

import svg from "./assets/react.svg"
import audio from "./assets/jeffbob.mp3"

import SpeedIcon from "./components/SpeedIcon.jsx";
import Backward15SecIcon from "./components/Backward15SecIcon.jsx";
import PlayIcon from "./components/PlayIcon.jsx";
import PuaseIcon from "./components/PuaseIcon.jsx";
import Forward15SecIcon from "./components/Forward15SecIcon.jsx";
import AddBookmarkIcon from "./components/AddBookmarkIcon.jsx";
import RemoveBookmarkIcon from "./components/RemoveBookmarkIcon.jsx";
import RedSpeedIcon from "./components/RedSpeedIcon.jsx";
import ArrowIcon from "./components/ArrowIcon.jsx";

function MusicPlayer() {
    const [showCover, setShowCover] = useState({})
    const [isShowCover, setIsShowCover] = useState(false)

    const audioRef = useRef(new Audio());
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [openPlaySpeedDropdown, setOpenPlaySpeedDropdown] = useState(false);
    const [playSpeed, setPlaySpeed] = useState(1);

    const playSpeedOptions = [0.5, 1, 1.5, 1.75, 2];


    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(audioRef.current.currentTime);
            setDuration(audioRef.current.duration);
        };

        audioRef.current.addEventListener("timeupdate", updateTime);

        return () => {
            audioRef.current.removeEventListener("timeupdate", updateTime);
        };
    }, []);

    const togglePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(prev => !prev);
    };

    const skipForward = () => {
        audioRef.current.currentTime += 15;
    };

    const skipBackward = () => {
        audioRef.current.currentTime -= 15;
    };

    const handleTimeChange = (e) => {
        const newTime = e.target.value * duration;
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    };

    const playSpeedClass = (speed) => {
        return speed === playSpeed ? "active" : "";
    };

    const handlePlaySpeedChange = (speed) => {
        setPlaySpeed(speed);
        audioRef.current.playbackRate = speed;
    };

    return (
        <div className="audio-player" style={{
            backgroundColor: "#242135"
        }}>
            <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                {
                    isShowCover && <button onClick={() => {
                        setShowCover({height: "0", opacity: "hidden"})
                        setIsShowCover(false)
                    }}>
                        <ArrowIcon/>
                    </button>
                }
                {
                    !isShowCover && <button onClick={() => {
                        setShowCover({height: "300px", opacity: "visible"})
                        setIsShowCover(true)

                    }} style={{
                        rotate: "180deg"
                    }}>
                        <ArrowIcon/>
                    </button>
                }
            </div>
            {/* <div className="cover-container" style={showCover}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem"
                }}>
                    <div style={{
                        width: "150px",
                        height: "150px",
                    }}>
                        <img src={svg} alt="svg" style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain"
                        }}/>
                    </div>
                    <span>The Dangerous Dentist</span>
                    <span>قسمت 12</span>
                </div>
                <h3>The Dangerous Dentist Podcast</h3>
            </div> */}
            <div className="audio-container">
                <audio src={audio} ref={audioRef}></audio>
                <div className="audio-controller-container">
                    <div className="audio-slider-container">
                        <p>
                            {`${formatTime(currentTime)} / ${formatTime(duration)}`}
                        </p>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={currentTime / duration || 0}
                            onChange={handleTimeChange}
                            className="audio-slider-bar"
                        />
                    </div>
                    <div className="audio-controller">
                        <div className="audio-speed-dropdown">
                            <button style={{
                                position: "relative",
                                zIndex: "999999"
                            }} onClick={() => setOpenPlaySpeedDropdown(prev => !prev)}>
                                {
                                    !openPlaySpeedDropdown ? <SpeedIcon/> : <RedSpeedIcon/>
                                }
                            </button>
                            <ul className={`audio-dropdown-items ${openPlaySpeedDropdown ? "show-dropdown-items" : ""}`}>
                                {playSpeedOptions.map(speed => (
                                    <li key={speed} className={`audio-dropdown-item ${playSpeedClass(speed)}`}
                                        onClick={() => handlePlaySpeedChange(speed)}>
                                        {speed}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "1rem"
                        }}>
                            <button onClick={skipBackward}>
                                <Backward15SecIcon/>
                            </button>
                            <button onClick={togglePlayPause}>
                                {isPlaying ? <PuaseIcon/> : <PlayIcon/>}
                            </button>
                            <button onClick={skipForward}>
                                <Forward15SecIcon/>
                            </button>
                        </div>
                        <div>
                            <button>
                                <AddBookmarkIcon/>
                            </button>
                            <button>
                                <RemoveBookmarkIcon/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MusicPlayer;