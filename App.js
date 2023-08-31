import React, { useEffect } from 'react'
import * as NavigationBar from 'expo-navigation-bar'

import Navigation from './src/navigation/Navigation'
import { StatusBar } from 'expo-status-bar'
import { NotificationProvider } from './src/context/NotificationContext'

export default function App () {
  useEffect(() => {
    const changeStatusBarColor = async () => {
      NavigationBar.setBackgroundColorAsync('#FFFFFF')
      NavigationBar.setButtonStyleAsync('dark')
    }
    changeStatusBarColor()
  }, [])

  return (
    <NotificationProvider>
        <StatusBar style='dark' backgroundColor='white' />
        <Navigation />
    </NotificationProvider>
  )
}

