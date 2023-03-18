import 'react'
import styles from './index.module.scss'
import LoginCard from './loginCard'
import LoginForm from './loginForm'

export default (props) => {
  return (
    <div className={styles.content}>
      <div className={styles.moderate}>
        <div className={styles.margin}>
          <h3>欢迎使用</h3>
          <p>机房预约系统</p>
        </div>
      </div>
      <div className={styles.loginPanel}>
        {/* @ts-ignore */}
        <LoginCard>
          <LoginForm />
        </LoginCard>
      </div>
    </div>
  )
}
