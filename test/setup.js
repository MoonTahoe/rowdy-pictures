import jsdom from 'jsdom'
import React from 'react'

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>')
global.window = document.defaultView
global.React = React
global.navigator = {userAgent: 'node.js'}