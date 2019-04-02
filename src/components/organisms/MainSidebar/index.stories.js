import React from 'react'
import { storiesOf } from '@storybook/react'
import { Organism } from 'components'

storiesOf('MainScreen', module)
  .add('default', () => (
    <MainSidebar />
  ))
  .add('collapsed', () => (
    <MainSidebar />
  ))
