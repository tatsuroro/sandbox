import React from 'react'
import Link from 'gatsby-link'

const IndexPage = () => (
  <div>
    <h1>Hi people</h1>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <Link to="/page-2/">Go to page 2</Link><br/><br/>

    <Link to="/pressrelease/test">pressrelease</Link><br/><br/>


    <Link to="/info/test">info</Link>
  </div>
)

export default IndexPage
