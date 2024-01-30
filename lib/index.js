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
const { isBoolean } = require('lodash')
const debug = require("debug")('ghost-inspector')

const failIfNotPassing = _.get( process, 'env.GHOSTINSPECTOR_FAIL_IF_NOT_PASS' ) || core.getInput('fail_if_not_pass');

const options = {
  apiKey: _.get( process, 'env.GHOSTINSPECTOR_API_KEY' ) || core.getInput('api_key'),
  suite: _.get( process, 'env.GHOSTINSPECTOR_SUITE' ) || core.getInput('suite'),
  startUrl: _.get( process, 'env.GHOSTINSPECTOR_START_URL' ) || core.getInput('start_url'),
  failIfNotPass: failIfNotPassing && (isBoolean(failIfNotPassing) || ['1','true','yes'].indexOf(failIfNotPassing.toLowerCase())) >= 0 ? true : false,
}

debug( 'options', JSON.stringify(options, undefined, 2) )

// Parse the OPTIONS from the environment or action input
let requestOptions = {};
try {
  const requestOptionsString = _.get(process, 'env.REQUEST_OPTIONS') || core.getInput('request_options');
  if (requestOptionsString) {
    requestOptions = JSON.parse(requestOptionsString);
  }
} catch (error) {
  console.error('Failed to parse OPTIONS:', error);
}

debug( 'request options', JSON.stringify(requestOptions, undefined, 2) )

const executeTestSuite = async ()=>{
  try {
    const response = await axios({
      method: 'GET',
      url: 'https://api.ghostinspector.com/v1/suites/' + options.suite + '/execute/',
      params: _.pickBy({
        apiKey: options.apiKey,
        startUrl: options.startUrl,
        ...requestOptions
      }, _.identity)
    });

    if( options.failIfNotPass) {
      switch(true) {
        case (_.get( response, 'data.code' ) !== "SUCCESS"):
          throw new Error("Error occurred on exectuing Unit Test");
        case (!(_.get( response, 'data.data[0].passing', false ))):
          throw new Error("Unit test did not pass");
      }
    }

    core.setOutput('content', JSON.stringify(_.get(response, 'data', {})))
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
