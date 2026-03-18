import { PropsWithChildren } from 'react'
import './app.scss'
import { View } from '@tarojs/components'

// function App({ children }: PropsWithChildren) {
//   debugger
//   console.log(children)
//   return children
// }

function App({ children }: PropsWithChildren) {
  return (
    <View>
      <View>1313414</View>
      {children}
    </View>
  )
}

export default App
