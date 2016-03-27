import './styles/style.scss'
import React from 'react'
import DevTools from '../../../assets/js/DevTools'


class Layout extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="cmp-layout">
        LAYOUT

        <section>
          {this.props.children}
        </section>

        <div>
          <DevTools />
        </div>
      </div>
    )
  }
}

export default Layout;
