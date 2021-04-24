import format from 'date-fns/format'
import React from 'react'
import ptBR from 'date-fns/locale/pt-BR'
import { CgDarkMode } from 'react-icons/cg'
import styles from './styles.module.scss'
import { useTheme } from '../../contexts/ThemeContext'

export function Header() {
  const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
    locale: ptBR
  });

  const { 
    isDark,
    changeTheme
  } = useTheme();

  return (
    <header className={isDark ? styles.darkMode : styles.headerContainer}>
      <img src="/logo.svg" alt="Podcastr"/>
      <p>O melhor para você ouvir, sempre</p>
      <span>{currentDate}<CgDarkMode onClick={changeTheme} className={styles.darkModeButton} /></span>
    </header>
  )
}