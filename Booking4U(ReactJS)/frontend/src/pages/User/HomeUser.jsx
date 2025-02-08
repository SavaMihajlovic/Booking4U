import React from 'react'
import Hotels from '../../components/Hotels/Hotels'

export const HomeUser = ({filterOpen}) => {
  return (
    <>
      <Hotels filterOpen={filterOpen}/>
    </>
  )
}
