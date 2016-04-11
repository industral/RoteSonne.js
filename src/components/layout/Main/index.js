import './styles/style.scss'
import React from 'react'
import Controls from '../../widget/Controls'
import DevTools from '../../../assets/js/DevTools'

class Layout extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="window cmp-layout">
        <header className="toolbar toolbar-header">
          <h1 className="title">RoteSonne.js</h1>

          <Controls />
        </header>

        <section className="window-content">
          {this.props.children}
        </section>

        <div>
          {process.env.REDUX ? <DevTools /> : false}
        </div>
      </div>
    )
  }
}

export default Layout;
