import { Card } from 'antd'
import type { ReactNode } from 'react'

const { Meta } = Card

const App: React.FC = (props: { children: ReactNode }) => (
  <Card
    hoverable
    style={{ width: 400 }}
    bordered={false}
    cover={
      <img
        alt="example"
        src="https://image.meiye.art/pic_1631421521121ylusaJInwOAZ5NK83P5Yy"
      />
    }>
    {props.children}
  </Card>
)

export default App
