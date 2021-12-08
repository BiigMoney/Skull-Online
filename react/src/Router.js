import {Fragment, useEffect} from "react"
import {BrowserRouter, Switch, Route} from "react-router-dom"
import Lobby from "./components/Lobby"
import WelcomePage from "./components/WelcomePage"
import Game from "./components/Game"
import LoadingSkull from "./components/LoadingSkull"
import background from "./assets/table.jpg"
import "bootstrap/dist/js/bootstrap.js"
import "bootstrap/js/src/collapse.js"
import "./bootstrap.css"
import "./extra.css"
import axios from "axios"
import {connect} from "react-redux"
import {loadData} from "./redux/actions"

let defaultURL = "https://rocky-savannah-29000.herokuapp.com"
//let defaultURL = "http://localhost:8000"
axios.defaults.baseURL = defaultURL
const Router = props => {
  const {loadData} = props
  useEffect(loadData, [loadData])
  return (
    <Fragment>
      {props.store.loading ? (
        <LoadingSkull />
      ) : props.store.fatalError ? (
        <div style={{backgroundImage: `url(${background})`, textAlign: "center", width: "100vw", height: "100vh", position: "absolute", top: 0, left: 0, overflow: "hidden"}}>
          <h1 style={{marginTop: 50}}>{props.store.fatalError}</h1>
        </div>
      ) : (
        <BrowserRouter>
          <Switch>
            <Route path="/" component={WelcomePage} exact />
            <Route path="/lobby" component={Lobby} />
            <Route path="/play" component={Game} />
          </Switch>
        </BrowserRouter>
      )}
    </Fragment>
  )
}

const mapStateToProps = state => ({
  store: state
})

const mapActionsToProps = {
  loadData
}

export default connect(mapStateToProps, mapActionsToProps)(Router)
