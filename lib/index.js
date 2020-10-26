/**
 * Run Ghost Inspector Test
 *
 * DEBUG=ghost-inspector node lib/index.js
 * 
 * @type {*|lodash}
 * @private
 */
const _ = require( 'lodash' )
const axios = require( 'axios' )
const core = require("@actions/core")
const github = require("@actions/github")
const debug = require("debug")('ghost-inspector')

debug( 'github.context.payload', JSON.stringify(github.context.payload, undefined, 2) )

const options = {
  apiKey: _.get( process, 'env.GHOSTINSPECTOR_API_KEY' ) || core.getInput('api_key'),
  suite: _.get( process, 'env.GHOSTINSPECTOR_SUITE' ) || core.getInput('suite'),
  startUrl: _.get( process, 'env.GHOSTINSPECTOR_START_URL' ) || core.getInput('start_url')
}

debug( 'options', JSON.stringify(options, undefined, 2) )

const executeTestSuite = async ()=>{
  try {
    const response = await axios({
      method: 'GET',
      url: 'https://api.ghostinspector.com/v1/suites/' + options.suite + '/execute/',
      params: _.pickBy({
        apiKey: options.apiKey,
        startUrl: options.startUrl,
      }, _.identity)
    });

    core.setOutput('content', _.get(response, 'data', {}))
    core.setOutput('time', new Date().toTimeString())
    core.setOutput('executionTime', _.get( response, 'data.data[0].executionTime' ))
    core.setOutput('passing', _.get( response, 'data.data[0].passing' ))
    core.setOutput('name', _.get( response, 'data.data[0].name' ))
    core.setOutput('endUrl', _.get( response, 'data.data[0].endUrl' ))
    core.setOutput('screenshot', _.get( response, 'data.data[0].screenshot.original.defaultUrl' ))
    core.setOutput('code', _.get( response, 'data.code' ))

  } catch (error) {
    core.setFailed(error.message);
  }
}

executeTestSuite()
