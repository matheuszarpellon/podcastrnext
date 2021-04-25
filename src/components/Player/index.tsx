import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(.5)

  const {episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        setPlayingState,
        clearPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious, 
        isMuted,
        setMutedState
      } = usePlayer()

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.volume = volume;
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0

    audioRef.current.addEventListener('timeupdate', event => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount
    setProgress(amount)
  }

  function handleVolume(amount: number) {
    amount = amount / 100
    audioRef.current.volume = amount
    setVolume(amount)
  }

  function handleMuted() { 
    setMutedState(true)
    audioRef.current.volume = 0
  }

  function handleIsMuted() {
    setMutedState(false)
    audioRef.current.volume = volume
  }

  function handleEpisodeEnded() {
    if(hasNext) {
      playNext()
    } else {
      clearPlayingState()
    }
  }

  const episode = episodeList[currentEpisodeIndex]

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora</strong>
      </header>

      { episode ? (
        <div className={styles.currentEpisode}>
          <Image 
          width={592}
          height={592}
          src={episode.thumbnail}
          objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Seleciona um podcast para ouvir</strong>
      </div>
      ) }

      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
          { episode ? (<Slider 
          max={episode.duration}
          value={progress}
          onChange={handleSeek}
          trackStyle={{ backgroundColor: '#04d361'}}
          railStyle={{ backgroundColor: '#9f75ff'}} 
          handleStyle={{ borderColor: '#04d361', borderWidth: 4}}

          />
          ) : (<div className={styles.emptySlider} />
          )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        { episode && (
          <audio
            src={episode.url} 
            ref={audioRef}
            autoPlay
            loop={isLooping}
            onPlay={() => setPlayingState(true)}
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
            onEnded={handleEpisodeEnded}
          />
        )}

        <div className={styles.buttons}>
          <button 
            type='button' 
            disabled={!episode || episodeList.length === 1}
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button
           type='button'
           className={styles.playButton} 
           disabled={!episode} 
           onClick={togglePlay}
           >

            { isPlaying 
              ? <img src="/pause.svg" alt="Tocar"/>
              : <img src="/play.svg" alt="Tocar"/> }
          </button>
          <button type='button' onClick={playNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Tocar próxima"/>
          </button>
          <button 
            type='button' 
            disabled={!episode} 
            onClick={toggleLoop} 
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
          </div>
          <div className={styles.volumeController}>
            { isMuted ? 
            <button
            type='button' 
            onClick={handleIsMuted}
            disabled={!episode}>
              <img src="/volume_off.svg" alt="Embaralhar"/>
            </button> : 
            <button
            type='button' 
            onClick={handleMuted}
            disabled={!episode}>
              <img src="/volume_up.svg" alt="Embaralhar"/>
            </button>
            }

            <Slider
            min={0}
            max={100}
            value={volume * 100}
            onChange={handleVolume}
            trackStyle={{ backgroundColor: '#04d361'}}
            railStyle={{ backgroundColor: '#9f75ff'}}
            handleStyle= {{ borderColor: '#04d361', borderWidth: 4}}
            />
          </div>
      </footer>
    </div>
  )
}